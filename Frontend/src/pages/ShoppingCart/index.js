import "./styles.css";
import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { usePDF } from "react-to-pdf";
import { Navbar } from "../../components/Navbar";
import { IconButton } from "../../components/IconButton";

function ShoppingCart() {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [removeLoading, setRemoveLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [items, setItems] = useState([
    // {
    //   pk_id: 1,
    //   title: "Der Kleine Prinz",
    //   price: 40,
    //   description:
    //     "Die Geschichte vom kleinen Prinzen, der unvermittelt bei einem notgelandeten Piloten in der Wüste auftaucht, fasziniert seit Jahrzehnten Kinder wie Erwachsene. Wir hören, woher der kleine Prinz kommt, welche seltsamen Planeten er besuchte und welche Abenteuer er erlebt hat. Wenn er uns danach wieder verlässt, sehen wir die Welt mit anderen Augen. Seine sanfte Weisheit berührt und verwundert uns, wir sind traurig, aber bereichert.",
    //   url: "https://i.postimg.cc/d1DqYBFT/Mask-group-5.png",
    // },
    // {
    //   pk_id: 2,
    //   title: "Der Kleine Prinz",
    //   price: 40,
    //   description:
    //     "Die Geschichte vom kleinen Prinzen, der unvermittelt bei einem notgelandeten Piloten in der Wüste auftaucht, fasziniert seit Jahrzehnten Kinder wie Erwachsene. Wir hören, woher der kleine Prinz kommt, welche seltsamen Planeten er besuchte und welche Abenteuer er erlebt hat. Wenn er uns danach wieder verlässt, sehen wir die Welt mit anderen Augen. Seine sanfte Weisheit berührt und verwundert uns, wir sind traurig, aber bereichert.",
    //   url: "https://i.postimg.cc/d1DqYBFT/Mask-group-5.png",
    // },
    // {
    //   pk_id: 3,
    //   title: "Der Kleine Prinz",
    //   price: 40,
    //   description:
    //     "Die Geschichte vom kleinen Prinzen, der unvermittelt bei einem notgelandeten Piloten in der Wüste auftaucht, fasziniert seit Jahrzehnten Kinder wie Erwachsene. Wir hören, woher der kleine Prinz kommt, welche seltsamen Planeten er besuchte und welche Abenteuer er erlebt hat. Wenn er uns danach wieder verlässt, sehen wir die Welt mit anderen Augen. Seine sanfte Weisheit berührt und verwundert uns, wir sind traurig, aber bereichert.",
    //   url: "https://i.postimg.cc/d1DqYBFT/Mask-group-5.png",
    // },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [login, setLogin] = useState(false);

  function verifyLogin() {
    if (!JSON.parse(sessionStorage.getItem("user"))) {
      setLogin(true);
    }
  }

  async function getShoppingCart() {
    try {
      const response = await fetch(
        `http://localhost:11915/carrinhoUsuario/${
          JSON.parse(sessionStorage.getItem("user")).id
        }`
      );
      const json = await response.json();
      console.log(json);

      setItems(
        json.map((book) => {
          return {
            id: book.id_carrinho,
            bookId: book.id_livro,
            title: book.nome,
            price: book.preco,
            url: book.imagem,
            author: book.autor,
            description: book.descricao,
            maxQuantity: book.quantidade,
          };
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function removeItem(id) {
    setRemoveLoading(true);
    try {
      const response = await fetch(
        `http://localhost:11915/deletarCarrinho/${id}`
      );

      setSelectedItems(selectedItems.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setRemoveLoading(false);
    }
  }

  async function buy() {
    setBuyLoading(true);
    try {
      const response = await fetch(`http://localhost:11915/pedidoADD/`, {
        method: "POST",
        body: JSON.stringify({
          id_usuario: JSON.parse(sessionStorage.getItem("user"))?.id,
          itens: selectedItems.map((item) => {
            return {
              preco_unitario: item.price,
              quantidade: item.quantity,
              id_livro: item.bookId,
            };
          }),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
    } finally {
      setBuyLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(verifyLogin, 500);
  }, []);

  useEffect(() => {
    !removeLoading && getShoppingCart();
  }, [removeLoading]);

  return (
    <div className="App">
      <Navbar
        login={login}
        setLogin={setLogin}
        loadingAction={removeLoading || buyLoading}
      />
      <div className="content" ref={targetRef}>
        {loading && <div className="page-animation" />}
        {step === 1 ? (
          <>
            <div className="shopping-cart">
              <h1>Carrinho de Compras</h1>
              <div className="items">
                {items.map((item) => (
                  <div className="item" key={item.id}>
                    <input
                      type="checkbox"
                      disabled={item.maxQuantity === 0}
                      checked={
                        selectedItems
                          .map(function (e) {
                            return e.id;
                          })
                          .indexOf(item.id) !== -1
                      }
                      onChange={() => {
                        const index = selectedItems
                          .map(function (e) {
                            return e.id;
                          })
                          .indexOf(item.id);

                        if (index === -1) {
                          setSelectedItems([
                            ...selectedItems,
                            { ...item, quantity: 1 },
                          ]);
                          console.log([...selectedItems, item]);
                        } else {
                          setSelectedItems(
                            selectedItems.filter(
                              (selectedItem) => selectedItem.id !== item.id
                            )
                          );
                        }
                      }}
                    ></input>
                    <div
                      className="book-cover"
                      style={{
                        filter: item.maxQuantity === 0 ? "grayscale(100%)" : "",
                      }}
                    >
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
                        <h2>
                          {item.title}{" "}
                          {item.maxQuantity === 0 ? "(Fora de Estoque)" : ""}
                        </h2>
                        <h2>R${item.price.toFixed(2)}</h2>
                      </div>
                      <p style={{ padding: "1.6rem" }}>{item.description}</p>
                      {selectedItems
                        .map(function (e) {
                          return e.id;
                        })
                        .indexOf(item.id) !== -1 && (
                        <>
                          <div className="quantity-selector">
                            <p
                              className="selector"
                              onClick={() => {
                                if (
                                  selectedItems[
                                    selectedItems
                                      .map(function (e) {
                                        return e.id;
                                      })
                                      .indexOf(item.id)
                                  ].quantity > 1
                                ) {
                                  const editedSelectedItems = [
                                    ...selectedItems,
                                  ];
                                  editedSelectedItems[
                                    selectedItems
                                      .map(function (e) {
                                        return e.id;
                                      })
                                      .indexOf(item.id)
                                  ].quantity--;
                                  setSelectedItems(editedSelectedItems);
                                }
                              }}
                            >
                              -
                            </p>
                            <div className="divider" />
                            <p style={{ margin: "0 0.8rem" }}>
                              {
                                selectedItems[
                                  selectedItems
                                    .map(function (e) {
                                      return e.id;
                                    })
                                    .indexOf(item.id)
                                ].quantity
                              }
                            </p>
                            <div className="divider" />
                            <p
                              className="selector"
                              onClick={() => {
                                if (
                                  selectedItems[
                                    selectedItems
                                      .map(function (e) {
                                        return e.id;
                                      })
                                      .indexOf(item.id)
                                  ].quantity < item.maxQuantity
                                ) {
                                  const editedSelectedItems = [
                                    ...selectedItems,
                                  ];
                                  editedSelectedItems[
                                    selectedItems
                                      .map(function (e) {
                                        return e.id;
                                      })
                                      .indexOf(item.id)
                                  ].quantity++;
                                  setSelectedItems(editedSelectedItems);
                                }
                              }}
                            >
                              +
                            </p>
                          </div>
                          <div
                            className="align-right"
                            style={{
                              marginRight: "1.6rem",
                              marginTop: "1.6rem",
                            }}
                          >
                            <IconButton
                              icon="delete"
                              onClick={() => removeItem(item.id)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="subtotal">
              <Button
                title={"Avançar"}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setStep(2);
                  }, 1500);

                  setTimeout(() => {
                    setLoading(false);
                  }, 3000);
                }}
                disabled={!selectedItems?.length}
              />
              <h2>
                Subtotal: R$
                {selectedItems
                  .reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.price * currentValue.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
                | {selectedItems.length} Produto
                {selectedItems.length !== 1 ? "s" : ""}
              </h2>
            </div>
          </>
        ) : (
          <div className="purchase-container">
            <div className="credit-card-container">
              <div className="credit-card">
                <input
                  placeholder="Dono do cartão"
                  className="credit-input"
                  type="text"
                />
                <input
                  placeholder="Número do cartão"
                  className="credit-input"
                  type="text"
                />
                <div>
                  <p style={{ marginBottom: "0.8rem" }}>Validade</p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.8rem",
                      overflow: "hidden",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <input
                      placeholder="MM"
                      className="credit-input"
                      type="text"
                    />
                    <p>/</p>
                    <input
                      placeholder="YY"
                      className="credit-input"
                      type="text"
                    />
                    <img
                      src={"./assets/visa.png"}
                      style={{ marginLeft: "0.4rem", minWidth: 0 }}
                    ></img>
                  </div>
                </div>
              </div>
              <div className="credit-card-back">
                <input placeholder="CVV" className="credit-input" type="text" />
              </div>
            </div>
            <div className="purchase-confirmation">
              <div
                style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}
              >
                <IconButton
                  icon="arrow_back"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setStep(1);
                    }, 1500);

                    setTimeout(() => {
                      setLoading(false);
                    }, 3000);
                  }}
                />
                <h1>{"    "}Confirmação da Compra</h1>
              </div>
              <div className="line"></div>
              <h2>
                Preço total: R${""}
                {selectedItems
                  .reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.price * currentValue.quantity,
                    0
                  )
                  .toFixed(2)}
              </h2>
              <div className="final-items-view">
                {selectedItems.map((item) => (
                  <div className="book-cover">
                    <img src={item.url}></img>
                    {item.quantity > 1 && (
                      <div className="quantity-circle">{item.quantity}</div>
                    )}
                  </div>
                ))}
              </div>
              <Button title={"Comprar"} onClick={buy} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
