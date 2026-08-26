![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. Retrieve students enrolled on '2023-08-01'
SELECT * FROM student_courses.students WHERE enrollment_date = '2023-08-01';
-- 2. Retrieve courses with credits = 4
SELECT * FROM student_courses.courses WHERE credits = 4;
-- 3. Retrieve the semester named 'Fall 2023'
SELECT * FROM student_courses.semesters WHERE semester_name = 'Fall 2023';
-- 4. Retrieve enrollments for student_id = 1
SELECT * FROM student_courses.student_courses WHERE student_id = 1;
-- 5. Retrieve courses offered in semester_id = 2
SELECT * FROM student_courses.courses WHERE semester_id = 2;
-- 6. Retrieve students with last_name = 'Doe'
SELECT * FROM student_courses.students WHERE last_name = 'Doe';
-- 7. Retrieve the course named 'Database Systems'
SELECT * FROM student_courses.courses WHERE course_name = 'Database Systems';
-- 8. Retrieve the semester that starts on '2024-01-15'
SELECT * FROM student_courses.semesters WHERE start_date = '2024-01-15';
-- 9. Retrieve the student with email = 'john.doe@example.com'
SELECT * FROM student_courses.students WHERE email = 'john.doe@example.com';
-- 10. Retrieve enrollments for course_id = 5
SELECT * FROM student_courses.student_courses WHERE course_id = 5;
```

## Inequality Operator (<>)
```sql
-- 1. Students not enrolled on '2025-03-01'
SELECT * FROM student_courses.students WHERE enrollment_date <> '2025-03-01';
-- 2. Courses with credits <> 3
SELECT * FROM student_courses.courses WHERE credits <> 3;
-- 3. Semesters where semester_id <> 4
SELECT * FROM student_courses.semesters WHERE semester_id <> 4;
-- 4. Enrollments where student_id <> 10
SELECT * FROM student_courses.student_courses WHERE student_id <> 10;
-- 5. Courses not offered in semester_id = 2
SELECT * FROM student_courses.courses WHERE semester_id <> 2;
-- 6. Students whose first_name <> 'John'
SELECT * FROM student_courses.students WHERE first_name <> 'John';
-- 7. Courses whose course_name <> 'Calculus I'
SELECT * FROM student_courses.courses WHERE course_name <> 'Calculus I';
-- 8. Semesters with start_date <> '2025-06-01'
SELECT * FROM student_courses.semesters WHERE start_date <> '2025-06-01';
-- 9. Students whose email <> 'jane.smith@example.com'
SELECT * FROM student_courses.students WHERE email <> 'jane.smith@example.com';
-- 10. Enrollments where course_id <> 3
SELECT * FROM student_courses.student_courses WHERE course_id <> 3;
```

## IN Operator
```sql
-- 1. Students with student_id IN (1,2,3)
SELECT * FROM student_courses.students WHERE student_id IN (1,2,3);
-- 2. Courses with credits IN (3,4)
SELECT * FROM student_courses.courses WHERE credits IN (3,4);
-- 3. Semesters with semester_id IN (1,3,5)
SELECT * FROM student_courses.semesters WHERE semester_id IN (1,3,5);
-- 4. Enrollments for course_id IN (1,2,3)
SELECT * FROM student_courses.student_courses WHERE course_id IN (1,2,3);
-- 5. Students with last_name IN ('Doe','Smith')
SELECT * FROM student_courses.students WHERE last_name IN ('Doe','Smith');
-- 6. Courses offered in semesters IN (2,4)
SELECT * FROM student_courses.courses WHERE semester_id IN (2,4);
-- 7. Students with email IN ('john.doe@example.com','jane.smith@example.com')
SELECT * FROM student_courses.students WHERE email IN ('john.doe@example.com','jane.smith@example.com');
-- 8. Courses with course_id IN (5,6,7)
SELECT * FROM student_courses.courses WHERE course_id IN (5,6,7);
-- 9. Enrollments for student_id IN (11,12,13)
SELECT * FROM student_courses.student_courses WHERE student_id IN (11,12,13);
-- 10. Semesters named IN ('Fall 2023','Spring 2024')
SELECT * FROM student_courses.semesters WHERE semester_name IN ('Fall 2023','Spring 2024');
```

## NOT IN Operator
```sql
-- 1. Students with student_id NOT IN (1,2,3)
SELECT * FROM student_courses.students WHERE student_id NOT IN (1,2,3);
-- 2. Courses with credits NOT IN (3)
SELECT * FROM student_courses.courses WHERE credits NOT IN (3);
-- 3. Semesters with semester_id NOT IN (1,5)
SELECT * FROM student_courses.semesters WHERE semester_id NOT IN (1,5);
-- 4. Enrollments where course_id NOT IN (1,4,7)
SELECT * FROM student_courses.student_courses WHERE course_id NOT IN (1,4,7);
-- 5. Students with last_name NOT IN ('Doe','Smith')
SELECT * FROM student_courses.students WHERE last_name NOT IN ('Doe','Smith');
-- 6. Courses not offered in semesters NOT IN (2,3)
SELECT * FROM student_courses.courses WHERE semester_id NOT IN (2,3);
-- 7. Students with email NOT IN ('john.doe@example.com','jane.smith@example.com')
SELECT * FROM student_courses.students WHERE email NOT IN ('john.doe@example.com','jane.smith@example.com');
-- 8. Courses with course_id NOT IN (2,5,8)
SELECT * FROM student_courses.courses WHERE course_id NOT IN (2,5,8);
-- 9. Enrollments where student_id NOT IN (11,12)
SELECT * FROM student_courses.student_courses WHERE student_id NOT IN (11,12);
-- 10. Semesters named NOT IN ('Summer 2024','Fall 2024')
SELECT * FROM student_courses.semesters WHERE semester_name NOT IN ('Summer 2024','Fall 2024');
```

## LIKE Operator
```sql
-- 1. Students with email LIKE '%@example.com'
SELECT * FROM student_courses.students WHERE email LIKE '%@example.com';
-- 2. Courses where course_name LIKE 'Introduction%'
SELECT * FROM student_courses.courses WHERE course_name LIKE 'Introduction%';
-- 3. Semesters with semester_name LIKE '%2024'
SELECT * FROM student_courses.semesters WHERE semester_name LIKE '%2024';
-- 4. Students where last_name LIKE 'M%'
SELECT * FROM student_courses.students WHERE last_name LIKE 'M%';
-- 5. Courses where course_name LIKE '%Data%'
SELECT * FROM student_courses.courses WHERE course_name LIKE '%Data%';
-- 6. Semesters with semester_name LIKE 'Fall%'
SELECT * FROM student_courses.semesters WHERE semester_name LIKE 'Fall%';
-- 7. Students where first_name LIKE '_a%'
SELECT * FROM student_courses.students WHERE first_name LIKE '_a%';
-- 8. Courses where course_name LIKE '%ing%'
SELECT * FROM student_courses.courses WHERE course_name LIKE '%ing%';
-- 9. Students where email LIKE '%martinez%'
SELECT * FROM student_courses.students WHERE email LIKE '%martinez%';
-- 10. Courses where course_name LIKE '%Systems'
SELECT * FROM student_courses.courses WHERE course_name LIKE '%Systems';
```

## NOT LIKE Operator
```sql
-- 1. Students with email NOT LIKE '%@example.com'
SELECT * FROM student_courses.students WHERE email NOT LIKE '%@example.com';
-- 2. Courses where course_name NOT LIKE '%Introduction%'
SELECT * FROM student_courses.courses WHERE course_name NOT LIKE '%Introduction%';
-- 3. Semesters where semester_name NOT LIKE '%2025'
SELECT * FROM student_courses.semesters WHERE semester_name NOT LIKE '%2025';
-- 4. Students where last_name NOT LIKE 'D%'
SELECT * FROM student_courses.students WHERE last_name NOT LIKE 'D%';
-- 5. Courses where course_name NOT LIKE '%Data%'
SELECT * FROM student_courses.courses WHERE course_name NOT LIKE '%Data%';
-- 6. Semesters where semester_name NOT LIKE 'Summer%'
SELECT * FROM student_courses.semesters WHERE semester_name NOT LIKE 'Summer%';
-- 7. Students where first_name NOT LIKE '_a%'
SELECT * FROM student_courses.students WHERE first_name NOT LIKE '_a%';
-- 8. Courses where course_name NOT LIKE '%ing%'
SELECT * FROM student_courses.courses WHERE course_name NOT LIKE '%ing%';
-- 9. Students where email NOT LIKE '%jessica%'
SELECT * FROM student_courses.students WHERE email NOT LIKE '%jessica%';
-- 10. Courses where course_name NOT LIKE '%Systems'
SELECT * FROM student_courses.courses WHERE course_name NOT LIKE '%Systems';
```

## BETWEEN Operator
```sql
-- 1. Students with enrollment_date BETWEEN '2023-08-01' AND '2023-08-10'
SELECT * FROM student_courses.students WHERE enrollment_date BETWEEN '2023-08-01' AND '2023-08-10';
-- 2. Courses with credits BETWEEN 3 AND 4
SELECT * FROM student_courses.courses WHERE credits BETWEEN 3 AND 4;
-- 3. Semesters with start_date BETWEEN '2024-01-01' AND '2025-01-01'
SELECT * FROM student_courses.semesters WHERE start_date BETWEEN '2024-01-01' AND '2025-01-01';
-- 4. Students with student_id BETWEEN 5 AND 15
SELECT * FROM student_courses.students WHERE student_id BETWEEN 5 AND 15;
-- 5. Courses with course_id BETWEEN 3 AND 8
SELECT * FROM student_courses.courses WHERE course_id BETWEEN 3 AND 8;
-- 6. Semesters with end_date BETWEEN '2024-05-15' AND '2025-05-15'
SELECT * FROM student_courses.semesters WHERE end_date BETWEEN '2024-05-15' AND '2025-05-15';
-- 7. Students with student_id BETWEEN 10 AND 20
SELECT * FROM student_courses.students WHERE student_id BETWEEN 10 AND 20;
-- 8. Courses with credits BETWEEN 2 AND 4
SELECT * FROM student_courses.courses WHERE credits BETWEEN 2 AND 4;
-- 9. Semesters with semester_id BETWEEN 2 AND 4
SELECT * FROM student_courses.semesters WHERE semester_id BETWEEN 2 AND 4;
-- 10. Enrollments where student_id BETWEEN 1 AND 10
SELECT * FROM student_courses.student_courses WHERE student_id BETWEEN 1 AND 10;
```

## Greater Than (>)
```sql
-- 1. Students with enrollment_date > '2024-01-01'
SELECT * FROM student_courses.students WHERE enrollment_date > '2024-01-01';
-- 2. Courses with credits > 3
SELECT * FROM student_courses.courses WHERE credits > 3;
-- 3. Semesters with semester_id > 4
SELECT * FROM student_courses.semesters WHERE semester_id > 4;
-- 4. Enrollments where course_id > 5
SELECT * FROM student_courses.student_courses WHERE course_id > 5;
-- 5. Students with student_id > 10
SELECT * FROM student_courses.students WHERE student_id > 10;
-- 6. Courses with course_id > 8
SELECT * FROM student_courses.courses WHERE course_id > 8;
-- 7. Semesters with end_date > '2024-12-31'
SELECT * FROM student_courses.semesters WHERE end_date > '2024-12-31';
-- 8. Students with enrollment_date > '2025-01-01'
SELECT * FROM student_courses.students WHERE enrollment_date > '2025-01-01';
-- 9. Courses with credits > 2
SELECT * FROM student_courses.courses WHERE credits > 2;
-- 10. Enrollments where student_id > 5
SELECT * FROM student_courses.student_courses WHERE student_id > 5;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Students with enrollment_date >= '2024-01-15'
SELECT * FROM student_courses.students WHERE enrollment_date >= '2024-01-15';
-- 2. Courses with credits >= 4
SELECT * FROM student_courses.courses WHERE credits >= 4;
-- 3. Semesters with semester_id >= 3
SELECT * FROM student_courses.semesters WHERE semester_id >= 3;
-- 4. Enrollments where course_id >= 5
SELECT * FROM student_courses.student_courses WHERE course_id >= 5;
-- 5. Students with student_id >= 15
SELECT * FROM student_courses.students WHERE student_id >= 15;
-- 6. Semesters with start_date >= '2025-06-01'
SELECT * FROM student_courses.semesters WHERE start_date >= '2025-06-01';
-- 7. Courses with credits >= 3
SELECT * FROM student_courses.courses WHERE credits >= 3;
-- 8. Students with enrollment_date >= '2023-12-01'
SELECT * FROM student_courses.students WHERE enrollment_date >= '2023-12-01';
-- 9. Semesters with end_date >= '2025-05-15'
SELECT * FROM student_courses.semesters WHERE end_date >= '2025-05-15';
-- 10. Enrollments where student_id >= 10
SELECT * FROM student_courses.student_courses WHERE student_id >= 10;
```

## Less Than (<)
```sql
-- 1. Students with enrollment_date < '2024-01-01'
SELECT * FROM student_courses.students WHERE enrollment_date < '2024-01-01';
-- 2. Courses with credits < 4
SELECT * FROM student_courses.courses WHERE credits < 4;
-- 3. Semesters with semester_id < 3
SELECT * FROM student_courses.semesters WHERE semester_id < 3;
-- 4. Enrollments where course_id < 5
SELECT * FROM student_courses.student_courses WHERE course_id < 5;
-- 5. Students with student_id < 5
SELECT * FROM student_courses.students WHERE student_id < 5;
-- 6. Semesters with start_date < '2024-06-01'
SELECT * FROM student_courses.semesters WHERE start_date < '2024-06-01';
-- 7. Courses with credits < 3
SELECT * FROM student_courses.courses WHERE credits < 3;
-- 8. Students with enrollment_date < '2023-09-01'
SELECT * FROM student_courses.students WHERE enrollment_date < '2023-09-01';
-- 9. Semesters with end_date < '2024-12-15'
SELECT * FROM student_courses.semesters WHERE end_date < '2024-12-15';
-- 10. Enrollments where student_id < 3
SELECT * FROM student_courses.student_courses WHERE student_id < 3;
```

## Less Than or Equal To (<=)
```sql
-- 1. Students with enrollment_date <= '2024-01-15'
SELECT * FROM student_courses.students WHERE enrollment_date <= '2024-01-15';
-- 2. Courses with credits <= 3
SELECT * FROM student_courses.courses WHERE credits <= 3;
-- 3. Semesters with semester_id <= 3
SELECT * FROM student_courses.semesters WHERE semester_id <= 3;
-- 4. Enrollments where course_id <= 5
SELECT * FROM student_courses.student_courses WHERE course_id <= 5;
-- 5. Students with student_id <= 5
SELECT * FROM student_courses.students WHERE student_id <= 5;
-- 6. Semesters with start_date <= '2024-09-01'
SELECT * FROM student_courses.semesters WHERE start_date <= '2024-09-01';
-- 7. Courses with credits <= 4
SELECT * FROM student_courses.courses WHERE credits <= 4;
-- 8. Students with enrollment_date <= '2023-08-05'
SELECT * FROM student_courses.students WHERE enrollment_date <= '2023-08-05';
-- 9. Semesters with end_date <= '2025-05-15'
SELECT * FROM student_courses.semesters WHERE end_date <= '2025-05-15';
-- 10. Enrollments where student_id <= 10
SELECT * FROM student_courses.student_courses WHERE student_id <= 10;
```

## EXISTS Operator
```sql
-- 1. Courses that have at least one enrollment
SELECT * FROM student_courses.courses c
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.course_id = c.course_id
);
-- 2. Students enrolled in at least one course
SELECT * FROM student_courses.students s
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id
);
-- 3. Semesters that offer at least one course
SELECT * FROM student_courses.semesters sem
WHERE EXISTS (
  SELECT 1 FROM student_courses.courses c
  WHERE c.semester_id = sem.semester_id
);
-- 4. Students enrolled in course 1
SELECT * FROM student_courses.students s
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id AND sc.course_id = 1
);
-- 5. Courses with enrollments by student 11
SELECT * FROM student_courses.courses c
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.course_id = c.course_id AND sc.student_id = 11
);
-- 6. Students who have taken a 4-credit course
SELECT * FROM student_courses.students s
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  JOIN student_courses.courses c2 ON sc.course_id = c2.course_id
  WHERE sc.student_id = s.student_id AND c2.credits = 4
);
-- 7. Semesters that have at least one 4-credit course
SELECT * FROM student_courses.semesters sem
WHERE EXISTS (
  SELECT 1 FROM student_courses.courses c
  WHERE c.semester_id = sem.semester_id AND c.credits = 4
);
-- 8. Courses in which 'Smith' is enrolled
SELECT * FROM student_courses.courses c
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  JOIN student_courses.students s2 ON sc.student_id = s2.student_id
  WHERE sc.course_id = c.course_id AND s2.last_name = 'Smith'
);
-- 9. Students enrolled in courses with course_id > 10
SELECT * FROM student_courses.students s
WHERE EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id AND sc.course_id > 10
);
-- 10. Semesters in which student 13 has a course
SELECT * FROM student_courses.semesters sem
WHERE EXISTS (
  SELECT 1 FROM student_courses.courses c
  JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  WHERE sc.student_id = 13 AND c.semester_id = sem.semester_id
);
```

## NOT EXISTS Operator
```sql
-- 1. Courses with no enrollments
SELECT * FROM student_courses.courses c
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.course_id = c.course_id
);
-- 2. Students not enrolled in any course
SELECT * FROM student_courses.students s
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id
);
-- 3. Semesters that offer no courses
SELECT * FROM student_courses.semesters sem
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.courses c
  WHERE c.semester_id = sem.semester_id
);
-- 4. Students not enrolled in course 1
SELECT * FROM student_courses.students s
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id AND sc.course_id = 1
);
-- 5. Courses not offered in semester 3
SELECT * FROM student_courses.courses c
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.courses c2
  WHERE c2.course_id = c.course_id AND c2.semester_id = 3
);
-- 6. Students who have not taken a 4-credit course
SELECT * FROM student_courses.students s
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  JOIN student_courses.courses c2 ON sc.course_id = c2.course_id
  WHERE sc.student_id = s.student_id AND c2.credits = 4
);
-- 7. Courses not taken by student 11
SELECT * FROM student_courses.courses c
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.course_id = c.course_id AND sc.student_id = 11
);
-- 8. Semesters in which student 13 has no courses
SELECT * FROM student_courses.semesters sem
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.courses c
  JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  WHERE sc.student_id = 13 AND c.semester_id = sem.semester_id
);
-- 9. Students who have not enrolled in courses with course_id > 10
SELECT * FROM student_courses.students s
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  WHERE sc.student_id = s.student_id AND sc.course_id > 10
);
-- 10. Courses with no students named 'Smith'
SELECT * FROM student_courses.courses c
WHERE NOT EXISTS (
  SELECT 1 FROM student_courses.student_courses sc
  JOIN student_courses.students s2 ON sc.student_id = s2.student_id
  WHERE sc.course_id = c.course_id AND s2.last_name = 'Smith'
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
