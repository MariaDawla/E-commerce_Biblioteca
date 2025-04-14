import { Button } from "../../components/Button";
import "./styles.css";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import useDebounce from "../../hooks/useDebounce";
import { IconButton } from "../../components/IconButton";
import { Alert } from "../../components/Alert";

function Books() {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [nameSearch, setNameSearch] = useState();
  const debouncedNameSearch = useDebounce(nameSearch, 1000);
  const [genres, setGenres] = useState();
  const [languages, setLanguages] = useState();
  const [genreSearch, setGenreSearch] = useState();
  const [languageSearch, setLanguageSearch] = useState();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [alertClosing, setAlertClosing] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const [position, setPosition] = useState();
  const elementRef = useRef(null);
  const [selectedBook, setSelectedBook] = useState();
  const [login, setLogin] = useState(false);

  function verifyLogin() {
    if (!JSON.parse(sessionStorage.getItem("user"))) {
      setLogin(true);
    }
  }

  async function getBooks() {
    try {
      const response = await fetch("http://localhost:11915/livro");
      const json = await response.json();

      setBooks(
        json.map((book) => {
          return {
            id: book.id,
            name: book.nome,
            price: book.preco,
            url: book.imagem,
            amountOfPages: book.numero_paginas,
            isbn: book.isbn,
            author: book.autor,
            description: book.descricao,
            publicationDate: book.data_publicacao,
            language: book.idioma,
          };
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function getFilteredBooks() {
    setLoadingFilters(true);
    try {
      const response = await fetch(
        `http://localhost:11915/livros?${
          debouncedNameSearch ? "nome=" + debouncedNameSearch : ""
        }&${genreSearch ? "genero=" + genreSearch : ""}&${
          languageSearch ? "idioma=" + languageSearch : ""
        }`
      );
      const json = await response.json();

      setBooks(
        json.map((book) => {
          return {
            id: book.id,
            name: book.nome,
            price: book.preco,
            url: book.imagem,
            amountOfPages: book.numero_paginas,
            isbn: book.isbn,
            author: book.autor,
            description: book.descricao,
            publicationDate: book.data_publicacao,
            language: book.idioma,
          };
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFilters(false);
    }
  }

  async function getRecommendedBooks() {
    try {
      const response = await fetch(
        `http://localhost:11915/livros?${
          selectedBook.author ? "autor=" + selectedBook.author : ""
        }`
      );
      const json = await response.json();

      setRecommendedBooks(
        json
          .filter((book) => book.id != selectedBook.id)
          .map((book) => {
            return {
              id: book.id,
              name: book.nome,
              price: book.preco,
              url: book.imagem,
              amountOfPages: book.numero_paginas,
              isbn: book.isbn,
              author: book.autor,
              description: book.descricao,
              publicationDate: book.data_publicacao,
              language: book.idioma,
            };
          })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function getGenres() {
    try {
      const response = await fetch(`http://localhost:11915/generos`);
      const json = await response.json();

      setGenres(
        json.map((genre) => {
          return { value: genre.genero };
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function getLanguages() {
    try {
      const response = await fetch(`http://localhost:11915/idiomas`);
      const json = await response.json();

      setLanguages(
        json.map((language) => {
          return { value: language.idioma };
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getLanguages();
    getGenres();
    setTimeout(verifyLogin, 500);
  }, []);

  function addToCart() {
    setLoadingCart(true);
    fetch(`http://localhost:11915/novoCarrinho`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_usuario: JSON.parse(sessionStorage.getItem("user")).id,
        id_livro: selectedBook.id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setAlertClosing(false);
        setAlertMessage("Livro adicionado no carrinho com sucesso.");
        setAlertStatus("success");
        setTimeout(() => {
          setAlertClosing(true);
        }, 10000);
        setLoadingCart(false);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  }

  useEffect(() => {
    if (debouncedNameSearch || languageSearch || genreSearch) {
      getFilteredBooks();
    } else {
      getBooks();
    }
  }, [debouncedNameSearch, languageSearch, genreSearch]);

  useEffect(() => {
    if (!selectedBook) return;

    getRecommendedBooks();
  }, [selectedBook]);

  return (
    <div className="App">
      <Navbar
        login={login}
        setLogin={setLogin}
        loadingAction={loadingCart || loadingFilters}
      />
      <div className="content" ref={elementRef}>
        {position && (
          <div
            className="circle-animation"
            style={{ top: position.y, left: position.x }}
          ></div>
        )}
        {selectedBook && (
          <div className="selected-book">
            <Alert
              alertClosing={alertClosing}
              alertMessage={alertMessage}
              alertStatus={alertStatus}
              setAlertClosing={setAlertClosing}
            />
            <div className="book-images-container">
              <img src={selectedBook.url}></img>
            </div>
            <div className="modal-content">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>{selectedBook.name}</h1>
                <IconButton
                  icon={"close"}
                  onClick={() => {
                    setSelectedBook(undefined);
                    setAlertClosing(false);
                    setAlertMessage("");
                    setRecommendedBooks(undefined);
                  }}
                />
              </div>
              <div className="modal-line"></div>
              <p>
                <strong>Descrição:</strong> {selectedBook.description}
              </p>
              <p className="price">
                <strong>Preço:</strong> R${selectedBook.price.toFixed(2)}
              </p>
              <div className="book-info">
                <div className="header-info">
                  <p>Número de páginas</p>
                  <h2>{selectedBook.amountOfPages}</h2>
                </div>
                <div className="header-info">
                  <p>Idioma</p>
                  <h2>{selectedBook.language}</h2>
                </div>
                <div className="header-info">
                  <p>ISBN</p>
                  <h2>{selectedBook.isbn}</h2>
                </div>
                <div className="header-info">
                  <p>Autor</p>
                  <h2>{selectedBook.author}</h2>
                </div>
                <div className="header-info">
                  <p>Publicação</p>
                  <h2>
                    {
                      selectedBook.publicationDate
                        .replaceAll("-", "/")
                        .split("T")[0]
                    }
                  </h2>
                </div>
              </div>
              <div className="align-right">
                <Button title={"Adicionar ao carrinho"} onClick={addToCart} />
              </div>
              {recommendedBooks?.length > 0 && (
                <h2 style={{ marginTop: "3.2rem", marginBottom: "1.6rem" }}>
                  Livros Recomendados
                </h2>
              )}
              <div className="books">
                {recommendedBooks?.map((book) => (
                  <div key={book.id} className="book-container">
                    <div
                      className="book-cover"
                      onClick={(event) => {
                        setPosition({
                          x: event.clientX - elementRef.current.offsetLeft,
                          y: event.clientY - elementRef.current.offsetTop,
                        });

                        setTimeout(() => {
                          setSelectedBook(undefined);
                          setRecommendedBooks([]);
                          setAlertClosing(false);
                          setAlertMessage("");
                        }, 1200);

                        setTimeout(() => {
                          setSelectedBook(book);
                          setPosition(undefined);
                        }, 1250);
                      }}
                    >
                      <img src={book.url}></img>
                    </div>
                    <div className="book-title">{book.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="books-container">
          <div className="filters">
            <input
              className="text-input"
              placeholder="Título"
              onChange={(e) => setNameSearch(e.target.value)}
              style={{ flex: 2 }}
            />
            <select
              className="text-input"
              onChange={(e) => setLanguageSearch(e.target.value)}
            >
              <option value={""}>Idioma</option>
              {languages?.map((language) => (
                <option value={language.value}>{language.value}</option>
              ))}
            </select>
            <select
              className="text-input"
              onChange={(e) => setGenreSearch(e.target.value)}
            >
              <option value={""}>Gênero</option>
              {genres?.map((genre) => (
                <option value={genre.value}>{genre.value}</option>
              ))}
            </select>
          </div>
          <div className="books">
            {books.map((book) => (
              <div key={book.id} className="book-container">
                <div
                  className="book-cover"
                  onClick={(event) => {
                    setPosition({
                      x: event.clientX - elementRef.current.offsetLeft,
                      y: event.clientY - elementRef.current.offsetTop,
                    });

                    setSelectedBook(undefined);

                    setTimeout(() => {
                      setSelectedBook(book);
                      setPosition(undefined);
                    }, 1250);
                  }}
                >
                  <img src={book.url}></img>
                </div>
                <div className="book-title">{book.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;
