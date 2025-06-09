import db from "#db/client";

export async function createTask(title, done, userId) {
  const sql = `INSERT INTO tasks(title, done, user_id) VALUES ($1,$2,$3) RETURNING *`;
  const {
    rows: [task],
  } = await db.query(sql, [title, done, userId]);
  return task;
}

export async function getTaskById(id) {
  const sql = `SELECT * FROM tasks WHERE id=$1`;
  const {
    rows: [task],
  } = await db.query(sql, [id]);
  return task;
}

export async function getTasksByUserId(userId) {
  const { rows } = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [
    userId,
  ]);
  return rows;
}

export async function updateTask(id, { title, done }) {
  const { rows } = await db.query(
    `UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *`,
    [title, done, id]
  );
  return rows[0];
}

export async function deleteTask(id) {
  await db.query(`DELETE FROM tasks WHERE id = $1`, [id]);
}
