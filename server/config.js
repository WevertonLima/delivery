var config = {
  dev: {
    url: "http://localhost/",
    port: 3000,
    ambiente: "DEV",
    database: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "SorayaBeatriz@45",
      database: "pizzaria",
    },
  },
};

exports.get = function get(ambiente) {
  if (ambiente.toLowerCase() === "dev") {
    return config.dev;
  }
};
