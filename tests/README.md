# End-to-end verification

Start SQL Server, Express, and React using the [project setup guide](../README.md#run-the-app). Use a disposable database if you want to add test records without affecting your working data.

| Case | Action | Expected result |
|---|---|---|
| TC-01 | Add a student with a new code. Refresh the page. | The student still appears in the list. |
| TC-02 | Save another student with the same code. | The API rejects the duplicate and the form shows the error. |
| TC-03 | Add a course and enroll the new student. Open the course's dated attendance roster. | The new student appears in the roster with an unrecorded status. |
| TC-04 | Mark the student as Present, save, change the same date to Late, and save again. | One row is inserted and then the same row is updated. Refresh and reopen the same roster to see Late. |
| TC-05 | Submit a batch containing an unenrolled student through the API smoke test. | The batch is rejected and none of its records are saved. |
| TC-06 | Open History and Reports with the new student, course, and date selected. | The history contains one Late record, and the report shows 100% Late. Withdraw the student and run the same report to verify that the historical record is retained. |
| TC-07 | Try to delete the student or course after enrollment. | SQL Server protects the linked records and the app shows a clear error. |

## Repeatable API smoke test

Use a **disposable** SQL Server database. Point an API instance at it after running the schema, then run:

```powershell
$env:ATTENDANCE_TEST_URL = "http://localhost:3001"
$env:ATTENDANCE_TEST_DISPOSABLE = "1"
node tests/attendance-smoke.mjs
```

The test creates a new course and students, verifies concurrent saves and rollback, and leaves its records in that database.

## Verification results

The integration suite passed on SQL Server 2022 using SQL Server Authentication. It covered clean database setup, all seven cases above, and browser navigation through students, courses, enrollments, attendance, and reports. The seed returned 50 students, 5 courses, 100 enrollments, and 400 attendance records. The SQL query script produced 80 matching attendance rows for the demo Database Systems course, and its summary matched the history. The browser also passed report pagination and a mobile-width layout check. Client lint and production build passed.
