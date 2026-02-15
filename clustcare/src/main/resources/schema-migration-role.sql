-- Optional: run only if you have existing data with old role values or column type issues.
-- With spring.jpa.hibernate.ddl-auto=update, Hibernate will create/alter users.role to VARCHAR(20).
-- If your DB already had ENUM or short VARCHAR and you see "Data truncated for column 'role'":

-- 1) Migrate legacy USER role to CLINIC (we now use only ADMIN and CLINIC):
-- UPDATE users SET role = 'CLINIC' WHERE role = 'USER';

-- 2) If column is ENUM, alter to VARCHAR(20) (MySQL example):
-- ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;

-- 3) Then restart the app so Hibernate can sync with the schema.
