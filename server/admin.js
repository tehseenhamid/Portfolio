// Manage reviews from the terminal:
//   node admin.js list            show every review (including hidden ones)
//   node admin.js hide <id>       hide a review from the website
//   node admin.js show <id>       show it again / approve it
//   node admin.js delete <id>     remove it permanently
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(process.env.DB_PATH || path.join(__dirname, 'data', 'reviews.db'));
const [cmd, id] = process.argv.slice(2);
if (cmd === 'list' || !cmd) {
  const rows = db.prepare('SELECT id, created_at, approved, name, business, rating, review FROM portfolio_reviews ORDER BY id DESC').all();
  if (!rows.length) console.log('No reviews yet.');
  rows.forEach(r => console.log(`#${r.id}  ${r.approved ? 'VISIBLE' : 'hidden '}  ${r.created_at}  ${r.name}${r.business ? ' (' + r.business + ')' : ''}  ${r.rating}/5\n      ${r.review}\n`));
} else if (['hide', 'show', 'delete'].includes(cmd) && id) {
  const info = cmd === 'delete' ? db.prepare('DELETE FROM portfolio_reviews WHERE id = ?').run(id)
    : db.prepare('UPDATE portfolio_reviews SET approved = ? WHERE id = ?').run(cmd === 'show' ? 1 : 0, id);
  console.log(info.changes ? `Done: review #${id} ${cmd === 'delete' ? 'deleted' : cmd === 'show' ? 'is now visible' : 'is now hidden'}.` : `No review with id ${id}.`);
} else console.log('Usage: node admin.js list | hide <id> | show <id> | delete <id>');
