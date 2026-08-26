![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. For each student, total courses taken
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name,
       COUNT(sc.course_id) OVER (PARTITION BY s.student_id) AS total_courses
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id;
-- 2. For each course, number of students enrolled
SELECT c.course_id, c.course_name,
       COUNT(sc.student_id) OVER (PARTITION BY c.course_id) AS student_count
FROM student_courses.courses c
LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id;
-- 3. Average credits across all courses
SELECT course_id, course_name, credits,
       AVG(credits) OVER () AS avg_credits_all
FROM student_courses.courses;
-- 4. Sum of credits per semester
SELECT sem.semester_id, sem.semester_name, c.course_id, c.credits,
       SUM(c.credits) OVER (PARTITION BY sem.semester_id) AS semester_credits_sum
FROM student_courses.semesters sem
LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id;
-- 5. Average credits per student
SELECT s.student_id, s.first_name + ' ' + s.last_name AS student_name, c.course_id, c.credits,
       AVG(c.credits) OVER (PARTITION BY s.student_id) AS avg_credits_by_student
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id;
-- 6. Max credit single course per semester
SELECT sem.semester_id, c.course_id, c.credits,
       MAX(c.credits) OVER (PARTITION BY sem.semester_id) AS max_credit_in_sem
FROM student_courses.semesters sem
LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id;
-- 7. Min credits course per student
SELECT s.student_id, c.course_id, c.credits,
       MIN(c.credits) OVER (PARTITION BY s.student_id) AS min_credit_by_student
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id;
-- 8. Cumulative count of courses ordered by course_id
SELECT course_id, course_name, credits,
       COUNT(*) OVER (ORDER BY course_id ROWS UNBOUNDED PRECEDING) AS cumulative_courses
FROM student_courses.courses;
-- 9. Running sum of credits per semester
SELECT sem.semester_id, c.course_id, c.credits,
       SUM(c.credits) OVER (PARTITION BY sem.semester_id ORDER BY c.course_id ROWS UNBOUNDED PRECEDING) AS running_credits
FROM student_courses.semesters sem
LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id;
-- 10. Distinct semesters count per student
SELECT sc.student_id,
       COUNT(DISTINCT c.semester_id) OVER (PARTITION BY sc.student_id) AS distinct_semesters
FROM student_courses.student_courses sc
JOIN student_courses.courses c ON sc.course_id = c.course_id;
```

## ROW_NUMBER()
```sql
-- 1. Row number for students by enrollment date
SELECT student_id, first_name + ' ' + last_name AS student_name,
       ROW_NUMBER() OVER (ORDER BY enrollment_date) AS rn
FROM student_courses.students;
-- 2. Row number per semester for courses by credits desc
SELECT c.course_id, c.course_name, c.semester_id,
       ROW_NUMBER() OVER (PARTITION BY c.semester_id ORDER BY c.credits DESC) AS rn_in_sem
FROM student_courses.courses c;
-- 3. Row number per student for their enrollments by course_id
SELECT sc.student_id, sc.course_id,
       ROW_NUMBER() OVER (PARTITION BY sc.student_id ORDER BY sc.course_id) AS rn_courses
FROM student_courses.student_courses sc;
-- 4. Sequential enrollment ID
SELECT *, ROW_NUMBER() OVER (ORDER BY student_id, course_id) AS enrollment_seq
FROM student_courses.student_courses;
-- 5. Top 3 courses per semester
SELECT * FROM (
  SELECT c.*, ROW_NUMBER() OVER (PARTITION BY semester_id ORDER BY credits DESC) AS rn
  FROM student_courses.courses c
) t WHERE rn <= 3;
-- 6. Row number for semesters by start_date desc
SELECT semester_id, semester_name,
       ROW_NUMBER() OVER (ORDER BY start_date DESC) AS rn_sem
FROM student_courses.semesters;
-- 7. Row number for courses by name
SELECT course_id, course_name,
       ROW_NUMBER() OVER (ORDER BY course_name) AS rn_name
FROM student_courses.courses;
-- 8. Row number per enrollment by student
SELECT sc.student_id, sc.course_id,
       ROW_NUMBER() OVER (PARTITION BY sc.student_id ORDER BY sc.course_id) AS rn_enroll
FROM student_courses.student_courses sc;
-- 9. Row number for students partitioned by enrollment year
SELECT student_id, first_name, last_name,
       ROW_NUMBER() OVER (PARTITION BY YEAR(enrollment_date) ORDER BY student_id) AS rn_per_year
FROM student_courses.students;
-- 10. Row number for courses partitioned by credit value
SELECT course_id, course_name, credits,
       ROW_NUMBER() OVER (PARTITION BY credits ORDER BY course_id) AS rn_by_credit
FROM student_courses.courses;
```

## RANK()
```sql
-- 1. Rank students by total courses taken
SELECT student_id, total_courses,
       RANK() OVER (ORDER BY total_courses DESC) AS course_rank
FROM (
  SELECT s.student_id, COUNT(sc.course_id) AS total_courses
  FROM student_courses.students s
  LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
  GROUP BY s.student_id
) t;
-- 2. Rank courses by student count
SELECT course_id, student_count,
       RANK() OVER (ORDER BY student_count DESC) AS rank_students
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 3. Rank semesters by number of courses offered
SELECT semester_id, course_count,
       RANK() OVER (ORDER BY course_count DESC) AS rank_sem
FROM (
  SELECT sem.semester_id, COUNT(c.course_id) AS course_count
  FROM student_courses.semesters sem
  LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id
  GROUP BY sem.semester_id
) t;
-- 4. Rank courses by credits
SELECT course_id, credits,
       RANK() OVER (ORDER BY credits DESC) AS credit_rank
FROM student_courses.courses;
-- 5. Rank students by name length
SELECT student_id, LEN(first_name + ' ' + last_name) AS name_len,
       RANK() OVER (ORDER BY LEN(first_name + ' ' + last_name) DESC) AS rank_name_len
FROM student_courses.students;
-- 6. Rank enrollments by student_id
SELECT student_id, course_id,
       RANK() OVER (ORDER BY student_id) AS rank_enroll
FROM student_courses.student_courses;
-- 7. Rank semesters by start_date
SELECT semester_id, start_date,
       RANK() OVER (ORDER BY start_date) AS rank_start
FROM student_courses.semesters;
-- 8. Rank courses partitioned by semester by credits
SELECT course_id, semester_id, credits,
       RANK() OVER (PARTITION BY semester_id ORDER BY credits DESC) AS rank_in_sem
FROM student_courses.courses;
-- 9. Rank students partitioned by enrollment year by student_id
SELECT student_id, YEAR(enrollment_date) AS yr,
       RANK() OVER (PARTITION BY YEAR(enrollment_date) ORDER BY student_id) AS rank_year
FROM student_courses.students;
-- 10. Rank semesters by duration days
SELECT semester_id,
       DATEDIFF(day, start_date, end_date) AS duration,
       RANK() OVER (ORDER BY DATEDIFF(day, start_date, end_date) DESC) AS rank_duration
FROM student_courses.semesters;
```

## DENSE_RANK()
```sql
-- 1. Dense rank students by total courses
SELECT student_id, total_courses,
       DENSE_RANK() OVER (ORDER BY total_courses DESC) AS dr_course
FROM (
  SELECT s.student_id, COUNT(sc.course_id) AS total_courses
  FROM student_courses.students s
  LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
  GROUP BY s.student_id
) t;
-- 2. Dense rank courses by student count
SELECT course_id, student_count,
       DENSE_RANK() OVER (ORDER BY student_count DESC) AS dr_students
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 3. Dense rank semesters by course count
SELECT semester_id, course_count,
       DENSE_RANK() OVER (ORDER BY course_count DESC) AS dr_sem
FROM (
  SELECT sem.semester_id, COUNT(c.course_id) AS course_count
  FROM student_courses.semesters sem
  LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id
  GROUP BY sem.semester_id
) t;
-- 4. Dense rank courses by credits
SELECT course_id, credits,
       DENSE_RANK() OVER (ORDER BY credits) AS dr_credit
FROM student_courses.courses;
-- 5. Dense rank students by name length
SELECT student_id, LEN(first_name + ' ' + last_name) AS name_len,
       DENSE_RANK() OVER (ORDER BY name_len) AS dr_name_len
FROM student_courses.students;
-- 6. Dense rank enrollments by course_id
SELECT student_id, course_id,
       DENSE_RANK() OVER (ORDER BY course_id) AS dr_enroll
FROM student_courses.student_courses;
-- 7. Dense rank semesters by start_date
SELECT semester_id, start_date,
       DENSE_RANK() OVER (ORDER BY start_date) AS dr_start
FROM student_courses.semesters;
-- 8. Dense rank courses partitioned by semester by credits
SELECT course_id, semester_id, credits,
       DENSE_RANK() OVER (PARTITION BY semester_id ORDER BY credits DESC) AS dr_in_sem
FROM student_courses.courses;
-- 9. Dense rank students partitioned by year by student_id
SELECT student_id, YEAR(enrollment_date) AS yr,
       DENSE_RANK() OVER (PARTITION BY YEAR(enrollment_date) ORDER BY student_id) AS dr_year
FROM student_courses.students;
-- 10. Dense rank semesters by duration
SELECT semester_id,
       DATEDIFF(day, start_date, end_date) AS duration,
       DENSE_RANK() OVER (ORDER BY duration) AS dr_duration
FROM student_courses.semesters;
```

## NTILE(n)
```sql
-- 1. Quartiles of students by enrollment_date
SELECT student_id, enrollment_date,
       NTILE(4) OVER (ORDER BY enrollment_date) AS quartile
FROM student_courses.students;
-- 2. Tertiles of courses by credits
SELECT course_id, credits,
       NTILE(3) OVER (ORDER BY credits) AS tertile
FROM student_courses.courses;
-- 3. Halves of semesters by start_date
SELECT semester_id, start_date,
       NTILE(2) OVER (ORDER BY start_date) AS half
FROM student_courses.semesters;
-- 4. Quintiles of students by name length
SELECT student_id, LEN(first_name + ' ' + last_name) AS name_len,
       NTILE(5) OVER (ORDER BY name_len) AS quintile
FROM student_courses.students;
-- 5. Quartiles of courses by student count
SELECT course_id, student_count,
       NTILE(4) OVER (ORDER BY student_count DESC) AS quartile_students
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 6. Pentiles of semesters by course count
SELECT semester_id, course_count,
       NTILE(5) OVER (ORDER BY course_count) AS pentile
FROM (
  SELECT sem.semester_id, COUNT(c.course_id) AS course_count
  FROM student_courses.semesters sem
  LEFT JOIN student_courses.courses c ON sem.semester_id = c.semester_id
  GROUP BY sem.semester_id
) t;
-- 7. Quartiles of students by distinct semesters
SELECT student_id, distinct_semesters,
       NTILE(4) OVER (ORDER BY distinct_semesters) AS quartile_sem
FROM (
  SELECT sc.student_id, COUNT(DISTINCT c.semester_id) AS distinct_semesters
  FROM student_courses.student_courses sc
  JOIN student_courses.courses c ON sc.course_id = c.course_id
  GROUP BY sc.student_id
) t;
-- 8. Tertiles of courses by cumulative courses
SELECT course_id, cumulative_courses,
       NTILE(3) OVER (ORDER BY cumulative_courses) AS tertile_cum
FROM (
  SELECT course_id, COUNT(*) OVER (ORDER BY course_id ROWS UNBOUNDED PRECEDING) AS cumulative_courses
  FROM student_courses.courses
) t;
-- 9. Halves of enrollments by student_id
SELECT student_id, course_id,
       NTILE(2) OVER (ORDER BY student_id) AS half_enroll
FROM student_courses.student_courses;
-- 10. Quartiles of semester duration
SELECT semester_id, duration,
       NTILE(4) OVER (ORDER BY duration) AS quartile_dur
FROM (
  SELECT semester_id, DATEDIFF(day, start_date, end_date) AS duration
  FROM student_courses.semesters
) t;
```

## LAG()
```sql
-- 1. Previous course_id per student
SELECT sc.student_id, sc.course_id,
       LAG(sc.course_id) OVER (PARTITION BY sc.student_id ORDER BY sc.course_id) AS prev_course
FROM student_courses.student_courses sc;
-- 2. Previous enrollment_date per student
SELECT student_id, enrollment_date,
       LAG(enrollment_date) OVER (PARTITION BY student_id ORDER BY enrollment_date) AS prev_enroll
FROM student_courses.students;
-- 3. Previous end_date per semester
SELECT semester_id, start_date, end_date,
       LAG(end_date) OVER (ORDER BY start_date) AS prev_end
FROM student_courses.semesters;
-- 4. Previous credits by course ordered by course_id
SELECT course_id, credits,
       LAG(credits) OVER (ORDER BY course_id) AS prev_credit
FROM student_courses.courses;
-- 5. Previous student full name by enrollment_date
SELECT student_id, first_name + ' ' + last_name AS student,
       LAG(first_name + ' ' + last_name) OVER (ORDER BY enrollment_date) AS prev_student
FROM student_courses.students;
-- 6. Previous semester_name per course
SELECT c.course_id, c.semester_id,
       LAG(sem.semester_name) OVER (ORDER BY c.course_id) AS prev_semester
FROM student_courses.courses c
JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;
-- 7. Previous student count per course
SELECT course_id, student_count,
       LAG(student_count) OVER (ORDER BY student_count) AS prev_count
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 8. Previous enrollment_seq
SELECT *, LAG(enrollment_seq) OVER (ORDER BY enrollment_seq) AS prev_seq
FROM (
  SELECT *, ROW_NUMBER() OVER (ORDER BY student_id, course_id) AS enrollment_seq
  FROM student_courses.student_courses
) t;
-- 9. Previous semester start_date
SELECT semester_id, start_date,
       LAG(start_date) OVER (ORDER BY start_date) AS prev_start
FROM student_courses.semesters;
-- 10. Previous average credits per student
SELECT student_id, avg_credits_by_student,
       LAG(avg_credits_by_student) OVER (ORDER BY student_id) AS prev_avg
FROM (
  SELECT s.student_id, AVG(c.credits) OVER (PARTITION BY s.student_id) AS avg_credits_by_student
  FROM student_courses.students s
  LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
  LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
) t;
```

## LEAD()
```sql
-- 1. Next course_id per student
SELECT sc.student_id, sc.course_id,
       LEAD(sc.course_id) OVER (PARTITION BY sc.student_id ORDER BY sc.course_id) AS next_course
FROM student_courses.student_courses sc;
-- 2. Next enrollment_date per student
SELECT student_id, enrollment_date,
       LEAD(enrollment_date) OVER (PARTITION BY student_id ORDER BY enrollment_date) AS next_enroll
FROM student_courses.students;
-- 3. Next end_date per semester
SELECT semester_id, start_date, end_date,
       LEAD(end_date) OVER (ORDER BY start_date) AS next_end
FROM student_courses.semesters;
-- 4. Next credits by course
SELECT course_id, credits,
       LEAD(credits) OVER (ORDER BY course_id) AS next_credit
FROM student_courses.courses;
-- 5. Next student full name by enrollment_date
SELECT student_id, first_name + ' ' + last_name AS student,
       LEAD(first_name + ' ' + last_name) OVER (ORDER BY enrollment_date) AS next_student
FROM student_courses.students;
-- 6. Next semester_name per course_id
SELECT c.course_id, c.semester_id,
       LEAD(sem.semester_name) OVER (ORDER BY c.course_id) AS next_semester
FROM student_courses.courses c
JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;
-- 7. Next student count per course
SELECT course_id, student_count,
       LEAD(student_count) OVER (ORDER BY student_count) AS next_count
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 8. Next enrollment_seq
SELECT *, LEAD(enrollment_seq) OVER (ORDER BY enrollment_seq) AS next_seq
FROM (
  SELECT *, ROW_NUMBER() OVER (ORDER BY student_id, course_id) AS enrollment_seq
  FROM student_courses.student_courses
) t;
-- 9. Next semester start_date
SELECT semester_id, start_date,
       LEAD(start_date) OVER (ORDER BY start_date) AS next_start
FROM student_courses.semesters;
-- 10. Next average credits per student
SELECT student_id, avg_credits_by_student,
       LEAD(avg_credits_by_student) OVER (ORDER BY student_id) AS next_avg
FROM (
  SELECT s.student_id, AVG(c.credits) OVER (PARTITION BY s.student_id) AS avg_credits_by_student
  FROM student_courses.students s
  LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
  LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
) t;
```

## FIRST_VALUE()
```sql
-- 1. First course by credits per semester
SELECT sem.semester_id, c.course_id, c.credits,
       FIRST_VALUE(c.course_name) OVER (PARTITION BY sem.semester_id ORDER BY c.credits DESC) AS top_course
FROM student_courses.semesters sem
JOIN student_courses.courses c ON sem.semester_id = c.semester_id;
-- 2. First student by enrollment date
SELECT student_id, first_name + ' ' + last_name AS student,
       FIRST_VALUE(first_name + ' ' + last_name) OVER (ORDER BY enrollment_date) AS first_enrolled
FROM student_courses.students;
-- 3. First semester start_date overall
SELECT semester_id, start_date,
       FIRST_VALUE(start_date) OVER (ORDER BY start_date) AS first_start
FROM student_courses.semesters;
-- 4. First course in alphabetic order
SELECT course_id, course_name,
       FIRST_VALUE(course_name) OVER (ORDER BY course_name) AS first_alpha
FROM student_courses.courses;
-- 5. First enrollment per student
SELECT sc.student_id, sc.course_id,
       FIRST_VALUE(course_id) OVER (PARTITION BY sc.student_id ORDER BY sc.course_id) AS first_course_taken
FROM student_courses.student_courses sc;
-- 6. First student by last_name
SELECT student_id, last_name,
       FIRST_VALUE(last_name) OVER (ORDER BY last_name) AS first_last
FROM student_courses.students;
-- 7. First semester by end_date
SELECT semester_id, end_date,
       FIRST_VALUE(end_date) OVER (ORDER BY end_date) AS first_end
FROM student_courses.semesters;
-- 8. First course by student count
SELECT course_id, student_count,
       FIRST_VALUE(course_id) OVER (ORDER BY student_count DESC) AS most_popular_course
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 9. First student per enrollment year
SELECT student_id, YEAR(enrollment_date) AS yr,
       FIRST_VALUE(student_id) OVER (PARTITION BY YEAR(enrollment_date) ORDER BY enrollment_date) AS first_of_year
FROM student_courses.students;
-- 10. First course code (semester-course)
SELECT course_id, semester_id,
       FIRST_VALUE(CAST(semester_id AS varchar) + '-' + CAST(course_id AS varchar)) OVER (ORDER BY course_id) AS first_code
FROM student_courses.courses;
```

## LAST_VALUE()
```sql
-- 1. Last course by credits per semester
SELECT sem.semester_id, c.course_id, c.credits,
       LAST_VALUE(c.course_name) OVER (PARTITION BY sem.semester_id ORDER BY c.credits ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS bottom_course
FROM student_courses.semesters sem
JOIN student_courses.courses c ON sem.semester_id = c.semester_id;
-- 2. Last student by enrollment date
SELECT student_id, first_name + ' ' + last_name AS student,
       LAST_VALUE(first_name + ' ' + last_name) OVER (ORDER BY enrollment_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_enrolled
FROM student_courses.students;
-- 3. Last semester start_date overall
SELECT semester_id, start_date,
       LAST_VALUE(start_date) OVER (ORDER BY start_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_start
FROM student_courses.semesters;
-- 4. Last course in alphabetic order
SELECT course_id, course_name,
       LAST_VALUE(course_name) OVER (ORDER BY course_name ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_alpha
FROM student_courses.courses;
-- 5. Last enrollment per student
SELECT sc.student_id, sc.course_id,
       LAST_VALUE(course_id) OVER (PARTITION BY sc.student_id ORDER BY sc.course_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_course_taken
FROM student_courses.student_courses sc;
-- 6. Last student by last_name
SELECT student_id, last_name,
       LAST_VALUE(last_name) OVER (ORDER BY last_name ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_last
FROM student_courses.students;
-- 7. Last semester by end_date
SELECT semester_id, end_date,
       LAST_VALUE(end_date) OVER (ORDER BY end_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_end
FROM student_courses.semesters;
-- 8. Last course by student count
SELECT course_id, student_count,
       LAST_VALUE(course_id) OVER (ORDER BY student_count DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS least_popular_course
FROM (
  SELECT c.course_id, COUNT(sc.student_id) AS student_count
  FROM student_courses.courses c
  LEFT JOIN student_courses.student_courses sc ON c.course_id = sc.course_id
  GROUP BY c.course_id
) t;
-- 9. Last student per enrollment year
SELECT student_id, YEAR(enrollment_date) AS yr,
       LAST_VALUE(student_id) OVER (PARTITION BY YEAR(enrollment_date) ORDER BY enrollment_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_of_year
FROM student_courses.students;
-- 10. Last course code (semester-course)
SELECT course_id, semester_id,
       LAST_VALUE(CAST(semester_id AS varchar) + '-' + CAST(course_id AS varchar)) OVER (ORDER BY course_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_code
FROM student_courses.courses;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
