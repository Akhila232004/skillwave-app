![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. List all distinct course and semester names
SELECT course_name AS name FROM student_courses.courses
UNION
SELECT semester_name FROM student_courses.semesters;

-- 2. List all student first names and course names
SELECT first_name AS value FROM student_courses.students
UNION
SELECT course_name FROM student_courses.courses;

-- 3. List all student last names and emails
SELECT last_name AS value FROM student_courses.students
UNION
SELECT email FROM student_courses.students;

-- 4. List all credits and semester IDs
SELECT credits AS num FROM student_courses.courses
UNION
SELECT semester_id FROM student_courses.semesters;

-- 5. List all student IDs and course IDs
SELECT student_id AS id FROM student_courses.students
UNION
SELECT course_id FROM student_courses.courses;

-- 6. List all student IDs enrolled in semester 2 or semester 3
SELECT sc.student_id FROM student_courses.student_courses sc
JOIN student_courses.courses c ON sc.course_id = c.course_id
WHERE c.semester_id = 2
UNION
SELECT sc.student_id FROM student_courses.student_courses sc
JOIN student_courses.courses c ON sc.course_id = c.course_id
WHERE c.semester_id = 3;

-- 7. List names of courses offered in Spring 2024 or Summer 2024
SELECT course_name FROM student_courses.courses WHERE semester_id = 2
UNION
SELECT course_name FROM student_courses.courses WHERE semester_id = 3;

-- 8. List student IDs enrolled in course 1 or course 2
SELECT student_id FROM student_courses.student_courses WHERE course_id = 1
UNION
SELECT student_id FROM student_courses.student_courses WHERE course_id = 2;

-- 9. List semester names in 2024 and 2025
SELECT semester_name FROM student_courses.semesters WHERE start_date BETWEEN '2024-01-01' AND '2024-12-31'
UNION
SELECT semester_name FROM student_courses.semesters WHERE start_date BETWEEN '2025-01-01' AND '2025-12-31';

-- 10. List all distinct first names and last names of students
SELECT first_name AS name FROM student_courses.students
UNION
SELECT last_name FROM student_courses.students;
```

## Intersect
```sql
-- 1. Student IDs who are in student_courses and enrolled on/after 2024-01-01
SELECT student_id FROM student_courses.student_courses
INTERSECT
SELECT student_id FROM student_courses.students WHERE enrollment_date >= '2024-01-01';

-- 2. Course IDs that have enrollments and are worth 4 credits
SELECT course_id FROM student_courses.student_courses
INTERSECT
SELECT course_id FROM student_courses.courses WHERE credits = 4;

-- 3. Semester IDs used by courses and starting in 2025
SELECT semester_id FROM student_courses.courses
INTERSECT
SELECT semester_id FROM student_courses.semesters WHERE start_date >= '2025-01-01';

-- 4. Student IDs who took course 1 and course 2
SELECT student_id FROM student_courses.student_courses WHERE course_id = 1
INTERSECT
SELECT student_id FROM student_courses.student_courses WHERE course_id = 2;

-- 5. Course IDs offered in semester 2 and with credits = 4
SELECT course_id FROM student_courses.courses WHERE semester_id = 2
INTERSECT
SELECT course_id FROM student_courses.courses WHERE credits = 4;

-- 6. Student IDs with last name starting 'M' and with any enrollment
SELECT student_id FROM student_courses.students WHERE last_name LIKE 'M%'
INTERSECT
SELECT student_id FROM student_courses.student_courses;

-- 7. Semester IDs ending before 2025 and used by courses
SELECT semester_id FROM student_courses.semesters WHERE end_date < '2025-01-01'
INTERSECT
SELECT DISTINCT semester_id FROM student_courses.courses;

-- 8. Course IDs containing 'Data' and that have enrollments
SELECT course_id FROM student_courses.courses WHERE course_name LIKE '%Data%'
INTERSECT
SELECT course_id FROM student_courses.student_courses;

-- 9. Student IDs with email at example.com and who took any course
SELECT student_id FROM student_courses.students WHERE email LIKE '%@example.com'
INTERSECT
SELECT student_id FROM student_courses.student_courses;

-- 10. Semester IDs for semesters in 2024 and those used by 'Machine Learning'
SELECT semester_id FROM student_courses.semesters WHERE start_date BETWEEN '2024-01-01' AND '2024-12-31'
INTERSECT
SELECT semester_id FROM student_courses.courses WHERE course_name = 'Machine Learning';
```

## Except
```sql
-- 1. Students not enrolled in any course
SELECT student_id FROM student_courses.students
EXCEPT
SELECT student_id FROM student_courses.student_courses;

-- 2. Courses without any enrollments
SELECT course_id FROM student_courses.courses
EXCEPT
SELECT course_id FROM student_courses.student_courses;

-- 3. Semesters with no courses offered
SELECT semester_id FROM student_courses.semesters
EXCEPT
SELECT DISTINCT semester_id FROM student_courses.courses;

-- 4. Credits not equal to 3
SELECT DISTINCT credits FROM student_courses.courses
EXCEPT
SELECT 3;

-- 5. Students enrolled between '2023-08-01' and '2023-08-10' except those on '2023-08-05'
SELECT student_id FROM student_courses.students WHERE enrollment_date BETWEEN '2023-08-01' AND '2023-08-10'
EXCEPT
SELECT student_id FROM student_courses.students WHERE enrollment_date = '2023-08-05';

-- 6. Course names except those containing 'Introduction'
SELECT course_name FROM student_courses.courses
EXCEPT
SELECT course_name FROM student_courses.courses WHERE course_name LIKE '%Introduction%';

-- 7. Student emails except those from example.com
SELECT email FROM student_courses.students
EXCEPT
SELECT email FROM student_courses.students WHERE email LIKE '%@example.com';

-- 8. Semester names except 'Fall' semesters
SELECT semester_name FROM student_courses.semesters
EXCEPT
SELECT semester_name FROM student_courses.semesters WHERE semester_name LIKE 'Fall%';

-- 9. Course IDs except those in semester 2
SELECT course_id FROM student_courses.courses
EXCEPT
SELECT course_id FROM student_courses.courses WHERE semester_id = 2;

-- 10. Semester start dates except those on/after '2025-01-01'
SELECT start_date FROM student_courses.semesters
EXCEPT
SELECT start_date FROM student_courses.semesters WHERE start_date >= '2025-01-01';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
