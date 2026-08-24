# PairEval: Product Backlog (Draft)

นี่คือแบบร่าง User Stories ทั้ง 8 ข้อสำหรับระบบ PairEval ตามรูปแบบที่กำหนดใน WS-02

	---
## User Story 1: Google OAuth Login
As a Student/Instructor, I want to log in using my university Google account, so that my identity is verified securely without needing a new password.

### Acceptance Criteria
- Given I am not logged in, when I click "Sign in with Google" and select a valid university email, then I am redirected to my dashboard.
- Given I try to log in, when I use a non-university email (e.g., personal @gmail.com), then the system rejects the login with the error "Please use your university email".

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 2: Create Classroom & Import Groups
As an Instructor, I want to create a classroom and import student groups (CSV), so that I can set up a new evaluation session quickly.

### Acceptance Criteria
- Given I am logged in as an Instructor, when I upload a valid CSV containing student emails and group names, then the system creates the classroom and assigns students to their groups.
- Given I am uploading a CSV, when the file has missing emails or invalid formats, then the system shows an error and does not create the classroom.

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 3: Start Evaluation Session
As an Instructor, I want to start a pairwise evaluation session for a classroom, so that students can begin evaluating their peers.

### Acceptance Criteria
- Given a classroom has groups assigned, when the Instructor clicks "Start Evaluation", then the system generates pairwise combinations for each group and sets the status to "Active".
- Given an evaluation is "Active", when a student logs in, then they can see the evaluation tasks.

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 4: View Pending Evaluations
As a Student, I want to see a list of my pending evaluations on the dashboard, so that I know which tasks I need to complete.

### Acceptance Criteria
- Given I am a student with an "Active" evaluation, when I view my dashboard, then I see a card showing "Pending Pairwise Evaluation" with the due date.
- Given I have completed all my evaluations, when I view my dashboard, then it shows "No pending evaluations".

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 5: Submit Pairwise Comparison
As a Student, I want to choose between two peers (A vs B) and submit my choice, so that my evaluation is recorded.

### Acceptance Criteria
- Given I am on the evaluation screen, when I select Peer A over Peer B and submit, then the choice is saved and the next pair is displayed.
- Given my network connection drops, when I submit a choice and it times out, then I can safely retry without the system recording duplicate votes (Idempotent).

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 6: Complete Evaluation Task
As a Student, I want to see a confirmation screen when I have compared all assigned pairs, so that I know my task is successfully finished.

### Acceptance Criteria
- Given I am on the last pair of my evaluation, when I submit my final choice, then I am redirected to a "Thank You" screen.
- Given I have already completed my evaluation, when I try to access the evaluation link again, then I see a message stating "You have already completed this evaluation".

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 7: Monitor Student Progress
As an Instructor, I want to see the completion status (e.g., 25/30 students finished) of an active evaluation, so that I can track progress and remind pending students.

### Acceptance Criteria
- Given an evaluation is active, when I view the classroom dashboard, then I see a progress bar showing the percentage of students who have completed their task.
- Given I view the student list, when I filter by "Pending", then I see only the students who have not yet finished their evaluations.

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง

---

## User Story 8: View Computed Scores
As an Instructor, I want to view the final computed ranking/scores of all students after the evaluation closes, so that I can use the results for grading.

### Acceptance Criteria
- Given the evaluation session is closed, when I click "View Results", then I see a table of students ranked by their computed pairwise score.
- Given I am viewing the results table, when I click "Export", then I can download the scores as a CSV file.

### Definition of Done
- [ ] Feature ทำงานได้ตาม acceptance criteria
- [ ] มี unit test ครอบคลุม business rule ของ story นี้
- [ ] มี E2E test สำหรับ AC อย่างน้อย 1 ข้อ
- [ ] Code ผ่าน review จากสมาชิกในกลุ่ม
- [ ] Deploy ขึ้น staging แล้วเปิดใช้ได้จริง
