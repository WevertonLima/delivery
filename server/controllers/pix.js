const QrCodePix = require("qrcode-pix");

const controllers = () => {
  const gerarQRCode = async (req) => {
    const qrCodePix = QrCodePix({
      version: "01",
      key: "test@mail.com.br", //or any PIX key
      name: "Fulano de Tal",
      city: "SAO PAULO",
      transactionId: "YOUR_TRANSACTION_ID", //max 25 characters
      message: "Pay me :)",
      cep: "99999999",
      value: 150.99,
    });

    var dados = {
      qrCode: qrCodePix.payload(),
      image: await qrCodePix.Pix(
        "123456789",
        "SILVA SILVA",
        "RIO DE JANEIRO",
        "0.10",
        "Pedido #123456",
        true
      ),
    };
    console.log(dados);
    return dados;
  };

  return Object.create({
    gerarQRCode,
  });
};

module.exports = Object.assign({ controllers });
