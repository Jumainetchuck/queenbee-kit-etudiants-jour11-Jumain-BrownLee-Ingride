export function requestLogger(req, res, next) {
  const debut = performance.now();

  res.on("finish", () => {
    const duree = performance.now() - debut;
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duree.toFixed(1)} ms`
    );
  });

  next();
}