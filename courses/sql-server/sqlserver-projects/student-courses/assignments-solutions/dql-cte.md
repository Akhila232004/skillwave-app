![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Get students enrolled after 2024-01-01
WITH recent_students AS (
  SELECT * FROM student_courses.students WHERE enrollment_date > '2024-01-01'
)
SELECT * FROM recent_students;

-- 2. Count courses per student
WITH course_counts AS (
  SELECT student_id, COUNT(course_id) AS courses_taken
  FROM student_courses.student_courses
  GROUP BY student_id
)
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, cc.courses_taken
FROM student_courses.students s
JOIN course_counts cc ON s.student_id = cc.student_id;

-- 3. Compute semester durations
WITH sem_durations AS (
  SELECT semester_id, semester_name,
         DATEDIFF(day, start_date, end_date) AS duration_days
  FROM student_courses.semesters
)
SELECT * FROM sem_durations WHERE duration_days > 100;

-- 4. Top 5 credit-heavy courses
WITH top_courses AS (
  SELECT course_id, course_name, credits,
         ROW_NUMBER() OVER (ORDER BY credits DESC) AS rn
  FROM student_courses.courses
)
SELECT course_id, course_name, credits
FROM top_courses
WHERE rn <= 5;

-- 5. Extract email domains
WITH email_domains AS (
  SELECT student_id,
         SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email)) AS domain
  FROM student_courses.students
)
SELECT * FROM email_domains WHERE domain = 'example.com';

-- 6. Join students and enrollments
WITH enrollments_cte AS (
  SELECT student_id, course_id
  FROM student_courses.student_courses
)
SELECT e.student_id, s.first_name + ' ' + s.last_name AS student_name, e.course_id
FROM enrollments_cte e
JOIN student_courses.students s ON e.student_id = s.student_id;

-- 7. Average credits by semester
WITH avg_credits AS (
  SELECT semester_id, AVG(credits) AS avg_credits
  FROM student_courses.courses
  GROUP BY semester_id
)
SELECT sem.semester_id, sem.semester_name, ac.avg_credits
FROM student_courses.semesters sem
JOIN avg_credits ac ON sem.semester_id = ac.semester_id;

-- 8. Courses with no enrollments
WITH no_enroll AS (
  SELECT course_id
  FROM student_courses.courses
  EXCEPT
  SELECT DISTINCT course_id FROM student_courses.student_courses
)
SELECT c.* FROM student_courses.courses c
JOIN no_enroll ne ON c.course_id = ne.course_id;

-- 9. Full names of students
WITH full_names AS (
  SELECT student_id, first_name + ' ' + last_name AS full_name
  FROM student_courses.students
)
SELECT * FROM full_names WHERE full_name LIKE 'J%';

-- 10. Semesters starting in 2025
WITH future_sems AS (
  SELECT * FROM student_courses.semesters WHERE start_date >= '2025-01-01'
)
SELECT semester_name, start_date, end_date FROM future_sems;
```

## Using Multiple CTEs
```sql
-- 1. Students below average course load
WITH student_counts AS (
  SELECT student_id, COUNT(*) AS cnt
  FROM student_courses.student_courses
  GROUP BY student_id
),
avg_count AS (
  SELECT AVG(cnt) AS avg_cnt FROM student_counts
)
SELECT sc.student_id, sc.cnt
FROM student_counts sc
CROSS JOIN avg_count ac
WHERE sc.cnt < ac.avg_cnt;

-- 2. Enrollments in courses > 3 credits
WITH course_credits AS (
  SELECT course_id, credits FROM student_courses.courses
),
high_credit_enroll AS (
  SELECT sc.student_id, sc.course_id
  FROM student_courses.student_courses sc
  JOIN course_credits cc ON sc.course_id = cc.course_id
  WHERE cc.credits > 3
)
SELECT * FROM high_credit_enroll;

-- 3. Long semesters with many courses
WITH sem_dur AS (
  SELECT semester_id, DATEDIFF(day, start_date, end_date) AS days
  FROM student_courses.semesters
),
long_sems AS (
  SELECT semester_id FROM sem_dur WHERE days > 100
)
SELECT c.course_id, c.course_name
FROM student_courses.courses c
JOIN long_sems ls ON c.semester_id = ls.semester_id;

-- 4. Top 3 students by enrollments
WITH enroll_counts AS (
  SELECT student_id, COUNT(*) AS cnt
  FROM student_courses.student_courses
  GROUP BY student_id
),
ranked_students AS (
  SELECT student_id, cnt,
         ROW_NUMBER() OVER (ORDER BY cnt DESC) AS rn
  FROM enroll_counts
)
SELECT student_id, cnt FROM ranked_students WHERE rn <= 3;

-- 5. Names and emails combined
WITH names AS (
  SELECT student_id, first_name FROM student_courses.students
),
emails AS (
  SELECT student_id, email FROM student_courses.students
)
SELECT n.student_id, n.first_name, e.email
FROM names n
JOIN emails e ON n.student_id = e.student_id;

-- 6. Semesters with above-average course count
WITH sem_course_counts AS (
  SELECT semester_id, COUNT(course_id) AS cnt
  FROM student_courses.courses
  GROUP BY semester_id
),
avg_sem_count AS (
  SELECT AVG(cnt) AS avg_cnt FROM sem_course_counts
)
SELECT s.semester_id, s.cnt
FROM sem_course_counts s
JOIN avg_sem_count a ON 1=1
WHERE s.cnt > a.avg_cnt;

-- 7. Students with no enrollments
WITH all_students AS (
  SELECT student_id FROM student_courses.students
),
enrolled_students AS (
  SELECT DISTINCT student_id FROM student_courses.student_courses
),
no_enroll AS (
  SELECT student_id FROM all_students
  EXCEPT
  SELECT student_id FROM enrolled_students
)
SELECT s.* FROM student_courses.students s
JOIN no_enroll ne ON s.student_id = ne.student_id;

-- 8. Course names and their enrollment counts
WITH courses_cte AS (
  SELECT course_id, course_name FROM student_courses.courses
),
counts_cte AS (
  SELECT course_id, COUNT(*) AS cnt
  FROM student_courses.student_courses
  GROUP BY course_id
)
SELECT c.course_name, ct.cnt
FROM courses_cte c
LEFT JOIN counts_cte ct ON c.course_id = ct.course_id;

-- 9. Semester-course mapping
WITH sems AS (
  SELECT semester_id, semester_name FROM student_courses.semesters
),
courses_sem AS (
  SELECT course_id, semester_id FROM student_courses.courses
)
SELECT s.semester_name, cs.course_id
FROM sems s
JOIN courses_sem cs ON s.semester_id = cs.semester_id;

-- 10. Students ordered by enrollment date
WITH student_info AS (
  SELECT student_id, first_name + ' ' + last_name AS full_name, enrollment_date
  FROM student_courses.students
),
ordered_students AS (
  SELECT * FROM student_info ORDER BY enrollment_date
)
SELECT * FROM ordered_students;
```

## Recursive CTEs
```sql
-- 1. Generate numbers 1 to 10
WITH nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM nums WHERE n < 10
)
SELECT * FROM nums;

-- 2. List weekly start dates for each semester
WITH weeks AS (
  SELECT semester_id, start_date AS week_start, end_date
  FROM student_courses.semesters
  UNION ALL
  SELECT semester_id, DATEADD(week, 1, week_start), end_date
  FROM weeks
  WHERE DATEADD(week, 1, week_start) <= end_date
)
SELECT semester_id, week_start
FROM weeks
ORDER BY semester_id, week_start;

-- 3. Expand all dates for semester 1
WITH dates AS (
  SELECT start_date AS dt, end_date FROM student_courses.semesters WHERE semester_id = 1
  UNION ALL
  SELECT DATEADD(day, 1, dt), end_date
  FROM dates
  WHERE DATEADD(day, 1, dt) <= end_date
)
SELECT dt FROM dates;

-- 4. Fibonacci sequence up to 100
WITH fib AS (
  SELECT 0 AS a, 1 AS b
  UNION ALL
  SELECT b, a+b FROM fib WHERE a + b <= 100
)
SELECT a, b FROM fib;

-- 5. Factorial 1! to 5!
WITH factorial(n, fact) AS (
  SELECT 1, 1
  UNION ALL
  SELECT n+1, (n+1)*fact FROM factorial WHERE n < 5
)
SELECT * FROM factorial;

-- 6. Generate sequence up to student count
WITH total AS (
  SELECT COUNT(*) AS cnt FROM student_courses.students
),
nums AS (
  SELECT 1 AS n, cnt FROM total
  UNION ALL
  SELECT n+1, cnt FROM nums WHERE n < cnt
)
SELECT n FROM nums;

-- 7. Sequential semesters by ID
WITH sems AS (
  SELECT semester_id, semester_name FROM student_courses.semesters WHERE semester_id = 1
  UNION ALL
  SELECT s.semester_id, s.semester_name
  FROM student_courses.semesters s
  JOIN sems ON s.semester_id = sems.semester_id + 1
)
SELECT * FROM sems;

-- 8. Duplicate a specific enrollment 3 times
WITH rep AS (
  SELECT student_id, course_id, 1 AS cnt
  FROM student_courses.student_courses
  WHERE student_id = 1
  UNION ALL
  SELECT student_id, course_id, cnt+1
  FROM rep WHERE cnt < 3
)
SELECT * FROM rep;

-- 9. Reverse string 'ABC'
WITH rev(orig, rest) AS (
  SELECT 'ABC', '' 
  UNION ALL
  SELECT SUBSTRING(orig, 2, LEN(orig)), LEFT(orig, 1) + rest
  FROM rev
  WHERE LEN(orig) > 0
)
SELECT TOP 1 rest AS reversed FROM rev WHERE LEN(orig) = 0;

-- 10. Numbers 1 to max semester_id
WITH max_sem AS (
  SELECT MAX(semester_id) AS max_id FROM student_courses.semesters
),
seq AS (
  SELECT 1 AS n, max_id FROM max_sem
  UNION ALL
  SELECT n+1, max_id FROM seq WHERE n < max_id
)
SELECT n FROM seq;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
