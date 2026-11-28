import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = process.env.ATTENDANCE_TEST_URL;
if (!base || process.env.ATTENDANCE_TEST_DISPOSABLE !== '1') {
  throw new Error('Set ATTENDANCE_TEST_URL and ATTENDANCE_TEST_DISPOSABLE=1 for an API backed by a disposable database.');
}

async function call(path, expected, method = 'GET', body) {
  const response = await fetch(new URL('/api' + path, base), {
    method,
    ...(body === undefined ? {} : {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  });
  const text = await response.text();
  assert.equal(response.status, expected, method + ' ' + path + ': ' + text);
  return text ? JSON.parse(text) : null;
}

const suffix = randomUUID().slice(0, 12);
const course = await call('/courses', 201, 'POST', { courseCode: 'TEST-' + suffix, courseName: 'Attendance test' });
const student = await call('/students', 201, 'POST', { studentCode: 'TEST-' + suffix, fullName: 'Attendance test student' });
const second = await call('/students', 201, 'POST', { studentCode: 'ALT-' + suffix, fullName: 'Unenrolled test student' });
const enrollments = '/courses/' + course.id + '/enrollments';
const date = '2026-11-10';
const path = '/attendance/' + course.id + '/' + date;
const params = new URLSearchParams({ courseId: course.id, studentId: student.id, from: date, to: date });
const report = '/attendance?' + params;
const mark = (status) => ({ studentId: student.id, status });
const save = (expected, ...marks) => call(path, expected, 'PUT', { marks });

assert.deepEqual(await call(path, 200), []);
await call(enrollments, 201, 'POST', { studentId: student.id });
const roster = await call(path, 200);
assert.equal(roster.length, 1);
assert.equal(roster[0].status, null);

await save(400, mark('Unknown'));
await save(400, mark('Late'), mark('Present'));
await call('/attendance/' + course.id + '/2026-02-30', 400);
await save(409, mark('Present'), { studentId: second.id, status: 'Absent' });
assert.equal((await call(report, 200)).summary.total, 0);

const results = await Promise.all([save(200, mark('Absent')), save(200, mark('Absent'))]);
assert.equal(results.reduce((total, item) => total + item.inserted, 0), 1);
assert.equal(results.reduce((total, item) => total + item.unchanged, 0), 1);

const original = await call(report, 200);
assert.equal(original.rows.length, 1);
assert.deepEqual(await save(200, mark('Late')), { inserted: 0, updated: 1, unchanged: 0 });

const history = await call(report, 200);
assert.equal(history.rows.length, 1);
assert.equal(history.rows[0].id, original.rows[0].id);
assert.equal(history.rows[0].status, 'Late');
assert.deepEqual(history.summary, {
  total: 1, present: 0, absent: 0, late: 1, presentPercent: 0, absentPercent: 0, latePercent: 100,
});

await call(enrollments + '/' + student.id, 204, 'DELETE');
assert.deepEqual(await call(path, 200), []);
await save(409, mark('Present'));
assert.deepEqual((await call(report, 200)).rows, history.rows);
await call('/students/' + student.id, 409, 'DELETE');
console.log('Attendance passed idempotence, simultaneous saves, batch rollback, reporting, and withdrawal history.');
