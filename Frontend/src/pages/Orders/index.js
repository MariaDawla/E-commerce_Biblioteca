import { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";

function Order() {
  const [items, setItems] = useState([]);
  const [login, setLogin] = useState(false);

  function verifyLogin() {
    if (!JSON.parse(sessionStorage.getItem("user"))) {
      setLogin(true);
    }
  }

  async function getOrders() {
    fetch(
      `http://localhost:11915/pedido/${
        JSON.parse(sessionStorage.getItem("user")).id
      }`
    )
      .then((response) => response.json())
      .then((json) => {
        setItems(
          json.map((item) => {
            return {
              url: item.imagem,
              price: item.preco,
              title: item.nome,
              quantity: item.quantidade,
              date: item.data_pedido,
            };
          })
        );
      });
  }

  useEffect(() => {
    getOrders();
    setTimeout(verifyLogin, 500);
  }, []);

  return (
    <div className="App">
      <Navbar login={login} setLogin={setLogin} />
      <div className="items" style={{ maxHeight: "100%" }}>
        {items.map((item) => (
          <div className="item">
            <div className="book-cover">
              <img src={item.url}></img>
            </div>
            <div style={{ flex: 1 }}>
              <div
                className="item"
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  paddingBottom: 0,
                }}
              >
                <h2>{item.title}</h2>
                <h2>R${(item.price * item.quantity).toFixed(2)}</h2>
              </div>
              <h2 style={{ padding: "1.6rem" }}>Quantidade: {item.quantity}</h2>
              <h2 style={{ padding: "0 1.6rem" }}>
                Data realizada: {item.date.split("T")[0].replaceAll("-", "/")}
              </h2>
              <h2 style={{ padding: "1.6rem" }}>
                Preço unitário: R${item.price.toFixed(2)}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
