
module.exports = () => {
  return db.connection.sync()
    .then(() => db.people.findAll({ include: [db.info, db.twitter, db.news] }))
    .then(calculateScore)
    .catch(e => log.error(e));
};

function calculateScore(people) {
  const sorted = people.map((p) => {
    p = p.get();
    p.info = p.info.get();
    p.news = p.news.get();
    p.twitter = p.twitter.get();
    let score = 0;
    let count = 0;

    if (p.twitter.handle) {
      count += 1;
      score += p.twitter.score;
    }

    if (count > 0) p.score = score / count;
    else p.score = 0;
    return {
      id: p.id,
      displayName: p.displayName,
      score: p.score,
      position: p.position,
    };
  }).sort((a, b) => b.score - a.score);

  return db.people.bulkCreate(sorted.map((p, position) => {
    position += 1;
    return {
      id: p.id,
      positionDelta: p.position === null ? 0 : p.position - position,
      position,
    };
  }), { updateOnDuplicate: ['id', 'position', 'positionDelta'] });
}
