![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Retrieve length of each student's first name
SELECT student_id, LEN(first_name) AS first_name_length 
FROM student_courses.students;
-- 2. Retrieve length of each student's last name
SELECT student_id, LEN(last_name) AS last_name_length 
FROM student_courses.students;
-- 3. Retrieve length of each course name
SELECT course_id, LEN(course_name) AS course_name_length 
FROM student_courses.courses;
-- 4. Retrieve length of each email address
SELECT student_id, LEN(email) AS email_length 
FROM student_courses.students;
-- 5. Retrieve length of each semester name
SELECT semester_id, LEN(semester_name) AS semester_name_length 
FROM student_courses.semesters;
-- 6. Retrieve length of full student name (first + space + last)
SELECT student_id, LEN(first_name + ' ' + last_name) AS full_name_length 
FROM student_courses.students;
-- 7. Find courses with name length > 15
SELECT course_id, course_name 
FROM student_courses.courses 
WHERE LEN(course_name) > 15;
-- 8. Order students by descending first name length
SELECT student_id, first_name 
FROM student_courses.students 
ORDER BY LEN(first_name) DESC;
-- 9. List top 5 longest emails
SELECT TOP 5 student_id, email 
FROM student_courses.students 
ORDER BY LEN(email) DESC;
-- 10. Count how many students have a first name length of exactly 4
SELECT LEN(first_name) AS name_length, COUNT(*) AS student_count 
FROM student_courses.students 
GROUP BY LEN(first_name) 
HAVING LEN(first_name) = 4;
```

## Substring Function (SUBSTRING)
```sql
-- 1. Get first 3 letters of each student's first name
SELECT student_id, SUBSTRING(first_name, 1, 3) AS first3 
FROM student_courses.students;
-- 2. Get last 3 letters of each student's last name
SELECT student_id, RIGHT(last_name, 3) AS last3 
FROM student_courses.students;
-- 3. Get course name prefix (first 5 characters)
SELECT course_id, SUBSTRING(course_name, 1, 5) AS course_prefix 
FROM student_courses.courses;
-- 4. Extract username from email (before '@')
SELECT student_id,
       SUBSTRING(email, 1, CHARINDEX('@', email) - 1) AS email_user
FROM student_courses.students;
-- 5. Extract domain from email (after '@')
SELECT student_id,
       SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email)) AS email_domain
FROM student_courses.students;
-- 6. Extract year part from semester_name (e.g. '2024')
SELECT semester_id,
       SUBSTRING(semester_name, CHARINDEX(' ', semester_name) + 1, 4) AS year_part
FROM student_courses.semesters;
-- 7. Get middle portion of a course name (chars 3–7)
SELECT course_id, SUBSTRING(course_name, 3, 5) AS mid_course 
FROM student_courses.courses;
-- 8. Extract month/day from enrollment_date as text
SELECT student_id, 
       SUBSTRING(CONVERT(VARCHAR(10), enrollment_date, 101), 1, 5) AS mmdd
FROM student_courses.students;
-- 9. Show 4-letter code from credits value (e.g. '4   ')
SELECT student_id, SUBSTRING(CAST(credits AS VARCHAR(4)), 1, 1) AS credit_code
FROM student_courses.courses;
-- 10. Extract first word of semester_name
SELECT semester_id,
       SUBSTRING(semester_name, 1, CHARINDEX(' ', semester_name + ' ') - 1) AS term_word
FROM student_courses.semesters;
```

## Concatenation Operator (+)
```sql
-- 1. Concatenate first and last names into full name
SELECT student_id, first_name + ' ' + last_name AS full_name 
FROM student_courses.students;
-- 2. Show student with email in parentheses
SELECT student_id, first_name + ' ' + last_name + ' (' + email + ')' AS info 
FROM student_courses.students;
-- 3. Prefix course names with semester name
SELECT c.course_id, sem.semester_name + ': ' + c.course_name AS course_info
FROM student_courses.courses c
JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;
-- 4. Combine course name and credits
SELECT course_id, course_name + ' - ' + CAST(credits AS VARCHAR(10)) + ' cr' AS desc 
FROM student_courses.courses;
-- 5. Create a label for semester with dates
SELECT semester_id,
       semester_name + ' (' + CONVERT(VARCHAR(10), start_date, 120) + ' to ' +
       CONVERT(VARCHAR(10), end_date, 120) + ')' AS label
FROM student_courses.semesters;
-- 6. Tag students with ID in name
SELECT student_id, '[' + CAST(student_id AS VARCHAR) + '] ' +
       first_name + ' ' + last_name AS tagged_name
FROM student_courses.students;
-- 7. Combine student name and number of courses taken
SELECT s.student_id,
       s.first_name + ' ' + s.last_name + ' has taken ' +
       CAST(COUNT(sc.course_id) AS VARCHAR) + ' courses' AS status
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.first_name, s.last_name;
-- 8. Concatenate email domain to student name
SELECT student_id, first_name + ' ' + last_name + '@' +
       SUBSTRING(email, CHARINDEX('@', email)+1, LEN(email)) AS new_info
FROM student_courses.students;
-- 9. Create unique code: first letter of first and last name
SELECT student_id,
       LEFT(first_name,1) + LEFT(last_name,1) + CAST(student_id AS VARCHAR) AS code
FROM student_courses.students;
-- 10. Build full course code: semester ID + course ID
SELECT c.course_id,
       CAST(c.semester_id AS VARCHAR) + '-' + CAST(c.course_id AS VARCHAR) AS course_code
FROM student_courses.courses c;
```

## Lower Function (LOWER)
```sql
-- 1. Convert all emails to lowercase
SELECT student_id, LOWER(email) AS lower_email 
FROM student_courses.students;
-- 2. Normalize course names to lowercase
SELECT course_id, LOWER(course_name) AS lower_course 
FROM student_courses.courses;
-- 3. Lowercase student full names
SELECT student_id, LOWER(first_name + ' ' + last_name) AS lower_name 
FROM student_courses.students;
-- 4. Lowercase semester names
SELECT semester_id, LOWER(semester_name) AS lower_semester 
FROM student_courses.semesters;
-- 5. Find courses containing 'data' case-insensitively
SELECT course_id, course_name 
FROM student_courses.courses 
WHERE LOWER(course_name) LIKE '%data%';
-- 6. Compare email domains ignoring case
SELECT student_id, email 
FROM student_courses.students 
WHERE LOWER(RIGHT(email, LEN(email) - CHARINDEX('@', email))) = 'example.com';
-- 7. List distinct lowercase first names
SELECT DISTINCT LOWER(first_name) 
FROM student_courses.students;
-- 8. Lowercase and trim whitespace
SELECT student_id, LOWER(TRIM(first_name)) AS clean_lower 
FROM student_courses.students;
-- 9. Lowercase credits concatenation
SELECT course_id,
       LOWER('Credits: ' + CAST(credits AS VARCHAR)) AS info 
FROM student_courses.courses;
-- 10. Order courses by lowercase name
SELECT course_id, course_name 
FROM student_courses.courses 
ORDER BY LOWER(course_name);
```

## Upper Function (UPPER)
```sql
-- 1. Convert all emails to uppercase
SELECT student_id, UPPER(email) AS upper_email 
FROM student_courses.students;
-- 2. Normalize course names to uppercase
SELECT course_id, UPPER(course_name) AS upper_course 
FROM student_courses.courses;
-- 3. Uppercase student full names
SELECT student_id, UPPER(first_name + ' ' + last_name) AS upper_name 
FROM student_courses.students;
-- 4. Uppercase semester names
SELECT semester_id, UPPER(semester_name) AS upper_semester 
FROM student_courses.semesters;
-- 5. Find students whose uppercase last name starts with 'SM'
SELECT student_id, last_name 
FROM student_courses.students 
WHERE UPPER(last_name) LIKE 'SM%';
-- 6. Uppercase and trim whitespace
SELECT student_id, UPPER(TRIM(last_name)) AS clean_upper 
FROM student_courses.students;
-- 7. Uppercase credits concatenation
SELECT course_id,
       UPPER('Cr: ' + CAST(credits AS VARCHAR)) AS info 
FROM student_courses.courses;
-- 8. Order students by uppercase last name
SELECT student_id, last_name 
FROM student_courses.students 
ORDER BY UPPER(last_name);
-- 9. Uppercase substring of course name
SELECT course_id, UPPER(SUBSTRING(course_name,1,4)) AS code 
FROM student_courses.courses;
-- 10. Uppercase domain check
SELECT student_id, email 
FROM student_courses.students 
WHERE UPPER(RIGHT(email, LEN(email)-CHARINDEX('@',email))) = 'EXAMPLE.COM';
```

## Trim Function (TRIM)
```sql
-- 1. Trim spaces from first names
SELECT student_id, TRIM(first_name) AS trimmed_first 
FROM student_courses.students;
-- 2. Trim spaces from last names
SELECT student_id, TRIM(last_name) AS trimmed_last 
FROM student_courses.students;
-- 3. Trim spaces from course names
SELECT course_id, TRIM(course_name) AS clean_course 
FROM student_courses.courses;
-- 4. Trim spaces from semester names
SELECT semester_id, TRIM(semester_name) AS clean_semester 
FROM student_courses.semesters;
-- 5. Find 'Mary' despite trailing space
SELECT student_id, first_name 
FROM student_courses.students 
WHERE TRIM(first_name) = 'Mary';
-- 6. Count students whose trimmed full name length > 10
SELECT student_id,
       LEN(TRIM(first_name + ' ' + last_name)) AS clean_length 
FROM student_courses.students
WHERE LEN(TRIM(first_name + ' ' + last_name)) > 10;
-- 7. Order courses by trimmed name
SELECT course_id, TRIM(course_name) AS clean_course 
FROM student_courses.courses 
ORDER BY TRIM(course_name);
-- 8. Show trimmed email
SELECT student_id, TRIM(email) AS clean_email 
FROM student_courses.students;
-- 9. Label semesters with trimmed name
SELECT semester_id, TRIM(semester_name) + ' Edition' AS label 
FROM student_courses.semesters;
-- 10. Trim and concatenate student names
SELECT student_id, TRIM(first_name) + ' ' + TRIM(last_name) AS full_clean 
FROM student_courses.students;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from first names
SELECT student_id, LTRIM('   ' + first_name) AS ltrim_test 
FROM student_courses.students;
-- 2. LTRIM email addresses
SELECT student_id, LTRIM(email) AS ltrim_email 
FROM student_courses.students;
-- 3. LTRIM course names
SELECT course_id, LTRIM(course_name) AS ltrim_course 
FROM student_courses.courses;
-- 4. LTRIM semester names
SELECT semester_id, LTRIM(semester_name) AS ltrim_semester 
FROM student_courses.semesters;
-- 5. Find names after LTRIM
SELECT student_id, LTRIM(first_name) 
FROM student_courses.students 
WHERE LTRIM(first_name) = first_name;
-- 6. LTRIM and then LEN
SELECT student_id, LEN(LTRIM(first_name)) AS len_ltrim 
FROM student_courses.students;
-- 7. LTRIM in concatenation
SELECT student_id, LTRIM(first_name) + '!' AS shout 
FROM student_courses.students;
-- 8. LTRIM and LEFT
SELECT student_id, LEFT(LTRIM(first_name),2) AS abbr 
FROM student_courses.students;
-- 9. LTRIM and LOWER
SELECT student_id, LOWER(LTRIM(last_name)) AS clean_lower 
FROM student_courses.students;
-- 10. LTRIM and SUBSTRING
SELECT student_id, SUBSTRING(LTRIM(email),1,CHARINDEX('@',email)-1) AS user 
FROM student_courses.students;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from first names
SELECT student_id, RTRIM(first_name) AS rtrim_first 
FROM student_courses.students;
-- 2. RTRIM email addresses
SELECT student_id, RTRIM(email) AS rtrim_email 
FROM student_courses.students;
-- 3. RTRIM course names
SELECT course_id, RTRIM(course_name) AS rtrim_course 
FROM student_courses.courses;
-- 4. RTRIM semester names
SELECT semester_id, RTRIM(semester_name) AS rtrim_semester 
FROM student_courses.semesters;
-- 5. Find names after RTRIM
SELECT student_id, RTRIM(first_name) 
FROM student_courses.students 
WHERE RTRIM(first_name) = first_name;
-- 6. RTRIM and LEN
SELECT student_id, LEN(RTRIM(first_name)) AS len_rtrim 
FROM student_courses.students;
-- 7. RTRIM in concatenation
SELECT student_id, RTRIM(last_name) + '!' AS shout 
FROM student_courses.students;
-- 8. RTRIM and RIGHT
SELECT student_id, RIGHT(RTRIM(email), LEN(email)-CHARINDEX('@',email)) AS domain 
FROM student_courses.students;
-- 9. RTRIM and UPPER
SELECT student_id, UPPER(RTRIM(course_name)) AS clean_upper 
FROM student_courses.courses;
-- 10. RTRIM and SUBSTRING
SELECT student_id, SUBSTRING(RTRIM(semester_name),1,4) AS term 
FROM student_courses.semesters;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in each email
SELECT student_id, CHARINDEX('@', email) AS at_pos 
FROM student_courses.students;
-- 2. Position of space in each course name
SELECT course_id, CHARINDEX(' ', course_name) AS space_pos 
FROM student_courses.courses;
-- 3. Position of '2025' in semester_name
SELECT semester_id, CHARINDEX('2025', semester_name) AS year_pos 
FROM student_courses.semesters;
-- 4. Position of 'son' in last_name
SELECT student_id, CHARINDEX('son', last_name) AS substr_pos 
FROM student_courses.students;
-- 5. Position of '-' in formatted dates
SELECT semester_id,
       CHARINDEX('-', CONVERT(VARCHAR(10), start_date, 120)) AS dash_pos
FROM student_courses.semesters;
-- 6. Position of first vowel in first_name (e.g. 'a')
SELECT student_id, CHARINDEX('a', LOWER(first_name)) AS vowel_pos 
FROM student_courses.students;
-- 7. Position of second space in full name
SELECT student_id,
       CHARINDEX(' ', first_name + ' ' + last_name, CHARINDEX(' ', first_name)+1) AS second_space
FROM student_courses.students;
-- 8. Position of 'Data' in course_name
SELECT course_id, CHARINDEX('Data', course_name) AS data_pos 
FROM student_courses.courses;
-- 9. Position of '.' in email
SELECT student_id, CHARINDEX('.', email, CHARINDEX('@', email)) AS dot_after_at 
FROM student_courses.students;
-- 10. Use CHARINDEX to split email domain
SELECT student_id,
       SUBSTRING(email, CHARINDEX('@', email)+1, LEN(email)) AS domain
FROM student_courses.students;
```

## Left Function (LEFT)
```sql
-- 1. First two letters of each first name
SELECT student_id, LEFT(first_name, 2) AS first2 
FROM student_courses.students;
-- 2. First three letters of each last name
SELECT student_id, LEFT(last_name, 3) AS last3 
FROM student_courses.students;
-- 3. Email user name (before '@')
SELECT student_id, LEFT(email, CHARINDEX('@', email)-1) AS user 
FROM student_courses.students;
-- 4. First five letters of course name
SELECT course_id, LEFT(course_name, 5) AS name5 
FROM student_courses.courses;
-- 5. First four characters (term) of semester_name
SELECT semester_id, LEFT(semester_name, 4) AS term 
FROM student_courses.semesters;
-- 6. Leftmost digit of credits
SELECT course_id, LEFT(CAST(credits AS VARCHAR), 1) AS credit_digit 
FROM student_courses.courses;
-- 7. First letter of first and last name
SELECT student_id,
       LEFT(first_name,1) + LEFT(last_name,1) AS initials
FROM student_courses.students;
-- 8. LEFT and UPPER combined
SELECT student_id, UPPER(LEFT(first_name,1)) AS initial 
FROM student_courses.students;
-- 9. LEFT with SUBSTRING
SELECT student_id,
       LEFT(SUBSTRING(email,1,CHARINDEX('@',email)-1),3) AS code
FROM student_courses.students;
-- 10. LEFT with concatenation
SELECT student_id,
       LEFT(first_name + last_name,4) AS name_code
FROM student_courses.students;
```

## Right Function (RIGHT)
```sql
-- 1. Last two letters of each first name
SELECT student_id, RIGHT(first_name,2) AS last2 
FROM student_courses.students;
-- 2. Last three letters of each last name
SELECT student_id, RIGHT(last_name,3) AS last3 
FROM student_courses.students;
-- 3. Email domain (after '@')
SELECT student_id, RIGHT(email, LEN(email)-CHARINDEX('@',email)) AS domain 
FROM student_courses.students;
-- 4. Last five letters of course name
SELECT course_id, RIGHT(course_name,5) AS name_end 
FROM student_courses.courses;
-- 5. Last four chars of semester_name
SELECT semester_id, RIGHT(semester_name,4) AS year 
FROM student_courses.semesters;
-- 6. RIGHT and UPPER
SELECT student_id, UPPER(RIGHT(last_name,2)) AS code 
FROM student_courses.students;
-- 7. RIGHT with CONCAT
SELECT student_id,
       RIGHT(first_name + last_name,3) AS name_snip
FROM student_courses.students;
-- 8. RIGHT and REPLACE
SELECT course_id,
       REPLACE(RIGHT(course_name,3),' ','_') AS suffix
FROM student_courses.courses;
-- 9. RIGHT and LEN filter
SELECT student_id, email 
FROM student_courses.students 
WHERE LEN(RIGHT(email,4)) = 4;
-- 10. RIGHT with TRIM
SELECT student_id, RIGHT(RTRIM(last_name),3) AS clean_end 
FROM student_courses.students;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse each first name
SELECT student_id, REVERSE(first_name) AS rev_first 
FROM student_courses.students;
-- 2. Reverse each last name
SELECT student_id, REVERSE(last_name) AS rev_last 
FROM student_courses.students;
-- 3. Reverse course names
SELECT course_id, REVERSE(course_name) AS rev_course 
FROM student_courses.courses;
-- 4. Reverse email strings
SELECT student_id, REVERSE(email) AS rev_email 
FROM student_courses.students;
-- 5. Reverse semester names
SELECT semester_id, REVERSE(semester_name) AS rev_semester 
FROM student_courses.semesters;
-- 6. Reverse full names
SELECT student_id, REVERSE(first_name + ' ' + last_name) AS rev_full 
FROM student_courses.students;
-- 7. Reverse and LEFT
SELECT student_id, LEFT(REVERSE(first_name),3) AS snippet 
FROM student_courses.students;
-- 8. Reverse and SUBSTRING
SELECT course_id, SUBSTRING(REVERSE(course_name),1,5) AS rev_part 
FROM student_courses.courses;
-- 9. Reverse domain part of email
SELECT student_id,
       REVERSE(SUBSTRING(email,CHARINDEX('@',email)+1,LEN(email))) AS rev_domain
FROM student_courses.students;
-- 10. Reverse semester label
SELECT semester_id,
       REVERSE(semester_name + ' ' + CAST(semester_id AS VARCHAR)) AS code
FROM student_courses.semesters;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace '@' with ' [at] ' in emails
SELECT student_id,
       REPLACE(email, '@', ' [at] ') AS safe_email
FROM student_courses.students;
-- 2. Replace spaces with underscores in course names
SELECT course_id,
       REPLACE(course_name, ' ', '_') AS code
FROM student_courses.courses;
-- 3. Replace '2024' with 'Year2024' in semester_name
SELECT semester_id,
       REPLACE(semester_name, '2024', 'Year2024') AS new_semester
FROM student_courses.semesters;
-- 4. Replace 'a' with '@' in last names
SELECT student_id,
       REPLACE(last_name, 'a', '@') AS leet_last
FROM student_courses.students;
-- 5. Replace 'e' with '3' in first names
SELECT student_id,
       REPLACE(first_name, 'e', '3') AS leet_first
FROM student_courses.students;
-- 6. Replace 'Computer' with 'CS' in course names
SELECT course_id,
       REPLACE(course_name, 'Computer', 'CS') AS short_name
FROM student_courses.courses;
-- 7. Replace 'Spring' with 'Sp' in semester_name
SELECT semester_id,
       REPLACE(semester_name, 'Spring', 'Sp') AS abbrev
FROM student_courses.semesters;
-- 8. Replace dashes in dates
SELECT semester_id,
       REPLACE(CONVERT(VARCHAR(10), start_date, 120), '-', '/') AS slash_date
FROM student_courses.semesters;
-- 9. Replace empty email with placeholder
SELECT student_id,
       REPLACE(ISNULL(email, ''), '', 'noemail@example.com') AS email_safe
FROM student_courses.students;
-- 10. Replace credits number with text
SELECT course_id,
       REPLACE(CAST(credits AS VARCHAR), '4', 'Four') AS credits_text
FROM student_courses.courses;
```

## Case Statement (CASE)
```sql
-- 1. Label credits as 'High' (>=4) or 'Low'
SELECT course_id,
       CASE WHEN credits >= 4 THEN 'High' ELSE 'Low' END AS credit_level
FROM student_courses.courses;
-- 2. Categorize students by enrollment year
SELECT student_id,
       CASE 
         WHEN YEAR(enrollment_date) = 2023 THEN '2023 intake'
         WHEN YEAR(enrollment_date) = 2024 THEN '2024 intake'
         ELSE 'Other'
       END AS cohort
FROM student_courses.students;
-- 3. Grade courses by credits
SELECT course_id,
       CASE credits
         WHEN 3 THEN 'Standard'
         WHEN 4 THEN 'Advanced'
         ELSE 'Other'
       END AS course_type
FROM student_courses.courses;
-- 4. Show semester season from name
SELECT semester_id,
       CASE 
         WHEN semester_name LIKE 'Fall%' THEN 'Autumn'
         WHEN semester_name LIKE 'Spring%' THEN 'Spring'
         WHEN semester_name LIKE 'Summer%' THEN 'Summer'
         ELSE 'Unknown'
       END AS season
FROM student_courses.semesters;
-- 5. Flag students with long names
SELECT student_id,
       CASE WHEN LEN(first_name + ' ' + last_name) > 12 THEN 'Long Name' ELSE 'Short Name' END AS name_flag
FROM student_courses.students;
-- 6. Indicate if email is example.com
SELECT student_id,
       CASE WHEN RIGHT(email, LEN(email)-CHARINDEX('@',email)) = 'example.com' THEN 'Internal' ELSE 'External' END AS domain_type
FROM student_courses.students;
-- 7. Show if a student has enrollments
SELECT student_id,
       CASE WHEN EXISTS (SELECT 1 FROM student_courses.student_courses sc WHERE sc.student_id = s.student_id)
            THEN 'Enrolled' ELSE 'None' END AS status
FROM student_courses.students s;
-- 8. Credit bracket by range
SELECT course_id,
       CASE 
         WHEN credits BETWEEN 1 AND 3 THEN 'Basic'
         WHEN credits BETWEEN 4 AND 5 THEN 'Premium'
         ELSE 'Other'
       END AS bracket
FROM student_courses.courses;
-- 9. Semester length category
SELECT semester_id,
       CASE 
         WHEN DATEDIFF(day, start_date, end_date) > 120 THEN 'Long'
         ELSE 'Short'
       END AS length_cat
FROM student_courses.semesters;
-- 10. Combine CASE and CONCAT
SELECT student_id,
       CASE WHEN YEAR(enrollment_date) = 2025 THEN '2025 Student' ELSE 'Other Year' END 
       + ' - ' + first_name + ' ' + last_name AS label
FROM student_courses.students;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Replace null last names with 'Unknown'
SELECT student_id, ISNULL(last_name, 'Unknown') AS last_name_safe 
FROM student_courses.students;
-- 2. Replace null course names with 'No Course'
SELECT course_id, ISNULL(course_name, 'No Course') AS course_safe 
FROM student_courses.courses;
-- 3. Show 0 when credits is null
SELECT course_id, ISNULL(credits, 0) AS credits_safe 
FROM student_courses.courses;
-- 4. Replace null semester_id in courses with -1
SELECT course_id, ISNULL(semester_id, -1) AS sem_id_safe 
FROM student_courses.courses;
-- 5. Replace null email with placeholder
SELECT student_id, ISNULL(email, 'noemail@tinitiate.com') AS email_safe 
FROM student_courses.students;
-- 6. ISNULL in concatenation
SELECT student_id, ISNULL(first_name, 'N/A') + ' ' + ISNULL(last_name, '') AS name_safe 
FROM student_courses.students;
-- 7. Default enrollment_date if null (use today)
SELECT student_id, ISNULL(CONVERT(VARCHAR(10), enrollment_date, 120), CONVERT(VARCHAR(10), GETDATE(), 120)) AS date_safe 
FROM student_courses.students;
-- 8. Use ISNULL on CHARINDEX result
SELECT student_id, ISNULL(CHARINDEX('z', email), 0) AS pos_safe 
FROM student_courses.students;
-- 9. ISNULL with SUM of credits
SELECT s.student_id, ISNULL(SUM(c.credits), 0) AS total_credits
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id
GROUP BY s.student_id;
-- 10. ISNULL on DATEDIFF result
SELECT semester_id, ISNULL(DATEDIFF(day, start_date, end_date), 0) AS duration_days 
FROM student_courses.semesters;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Use COALESCE to pick first non-null between two names
SELECT student_id, COALESCE(NULL, first_name) AS pick_name 
FROM student_courses.students;
-- 2. COALESCE email or default
SELECT student_id, COALESCE(email, 'noemail@tinitiate.com') AS email_safe 
FROM student_courses.students;
-- 3. COALESCE credits or 0
SELECT course_id, COALESCE(credits, 0) AS credits_safe 
FROM student_courses.courses;
-- 4. COALESCE semester_name or 'TBD'
SELECT semester_id, COALESCE(semester_name, 'TBD') AS sem_safe 
FROM student_courses.semesters;
-- 5. COALESCE in concatenation
SELECT student_id, COALESCE(first_name, '') + ' ' + COALESCE(last_name, '') AS name_full 
FROM student_courses.students;
-- 6. COALESCE on join result: show course or 'None'
SELECT s.student_id,
       COALESCE(c.course_name, 'None') AS course_or_none
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
LEFT JOIN student_courses.courses c ON sc.course_id = c.course_id;
-- 7. COALESCE on CHARINDEX
SELECT student_id, COALESCE(CHARINDEX('x', email), 0) AS pos 
FROM student_courses.students;
-- 8. COALESCE on SUBSTRING
SELECT student_id,
       COALESCE(SUBSTRING(email,1,5), 'n/a') AS snippet
FROM student_courses.students;
-- 9. COALESCE on CASE
SELECT course_id,
       COALESCE(
         CASE WHEN credits > 3 THEN 'Big' END,
         'Small'
       ) AS size
FROM student_courses.courses;
-- 10. COALESCE in GROUP BY context
SELECT student_id, COALESCE(COUNT(sc.course_id), 0) AS enroll_count
FROM student_courses.students s
LEFT JOIN student_courses.student_courses sc ON s.student_id = sc.student_id
GROUP BY student_id;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
