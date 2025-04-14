import MaskInput from "react-maskinput";
import { NumericFormat } from "react-number-format";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import useDebounce from "../../hooks/useDebounce";
import { IconButton } from "../../components/IconButton";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";

function Seller() {
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

  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: -1,
    nome: "",
    titulo_original: "",
    genero: "",
    idioma: "",
    autor: "",
    editora: "",
    preco: "",
    numero_paginas: "",
    isbn: "",
    data_publicacao: "",
    imagem: "",
    descricao: "",
    quantidade: "",
    id_vendedor: JSON.parse(sessionStorage.getItem("user"))?.id,
  });

  function handleChange(e) {
    if (e.target.name === "preco") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.split("R$")[1],
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

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
      const response = await fetch(
        `http://localhost:11915/livrosVendedor/${
          JSON.parse(sessionStorage.getItem("user")).id
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
            originalTitle: book.titulo_original,
            genre: book.genero,
            isbn: book.isbn,
            author: book.autor,
            description: book.descricao,
            publicationDate: book.data_publicacao,
            language: book.idioma,
            editor: book.editora,
            quantity: book.quantidade,
          };
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function getFilteredBooks() {
    try {
      const response = await fetch(
        `http://localhost:11915/livros?${
          debouncedNameSearch ? "nome=" + debouncedNameSearch : ""
        }&${genreSearch ? "genero=" + genreSearch : ""}&${
          languageSearch ? "idioma=" + languageSearch : ""
        }&id_vendedor=${JSON.parse(sessionStorage.getItem("user")).id}`
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

  async function deleteBook(id) {
    setLoading(true);
    try {
      await fetch(`http://localhost:11915/livroDEL/${id}`);
      setSelectedBook(undefined);
      setAlertClosing(false);
      setAlertMessage("");
      setRecommendedBooks(undefined);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function saveBook() {
    setLoading(true);
    if (formData?.id !== -1) {
      const response = await fetch(`http://localhost:11915/livroUPT/`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (json) {
        setAlertClosing(false);
        setAlertMessage("Livro atualizado com sucesso.");
        setAlertStatus("success");
        setTimeout(() => {
          setAlertClosing(true);
        }, 10000);
      }
    } else {
      const response = await fetch(`http://localhost:11915/livroADD/`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (json) {
        setAlertClosing(false);
        setAlertMessage("Livro criado com sucesso.");
        setAlertStatus("success");
        setTimeout(() => {
          setAlertClosing(true);
        }, 10000);
      }
    }
    setLoading(false);
  }

  function checkImageExists(url) {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = function () {
        if (this.width > 0) {
          console.log("image exists");
          resolve(true);
        } else {
          resolve(false);
        }
      };

      image.onerror = function () {
        console.log("image doesn't exist");
        resolve(false);
      };

      image.src = url;
    });
  }

  useEffect(() => {
    let isMounted = true;
    checkImageExists(formData.imagem).then((result) => {
      if (isMounted) {
        setImageExists(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [formData.imagem]);

  useEffect(() => {
    getLanguages();
    getGenres();
    setTimeout(verifyLogin, 500);
  }, []);

  useEffect(() => {
    if (debouncedNameSearch || languageSearch || genreSearch) {
      getFilteredBooks();
    } else {
      getBooks();
    }
  }, [debouncedNameSearch, languageSearch, genreSearch, loading]);

  return (
    <div className="App">
      <Navbar login={login} setLogin={setLogin} loadingAction={loading} />
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
              setAlertClosing={setAlertClosing}
              alertClosing={alertClosing}
              alertMessage={alertMessage}
              alertStatus={alertStatus}
            />
            {imageExists && (
              <div className="book-images-container">
                <img src={formData?.imagem}></img>
              </div>
            )}
            <div
              className="modal-content"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.4rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>
                  {formData?.id === -1 ? "Adicionar um livro" : formData?.nome}
                </h1>
                <div style={{ display: "flex", gap: "1.2rem" }}>
                  {formData?.id !== -1 && (
                    <IconButton
                      icon={"delete"}
                      onClick={() => deleteBook(formData?.id)}
                    />
                  )}
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
              </div>

              <div className="input-container">
                <input
                  className="text-input"
                  placeholder="Nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Título Original"
                  type="text"
                  name="titulo_original"
                  value={formData.titulo_original}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-container">
                <select
                  className="text-input"
                  onChange={handleChange}
                  value={formData.idioma}
                  name="idioma"
                >
                  <option value={""}>Idioma</option>
                  {languages?.map((language) => (
                    <option value={language.value}>{language.value}</option>
                  ))}
                </select>
                <select
                  className="text-input"
                  onChange={handleChange}
                  value={formData.genero}
                  name="genero"
                >
                  <option value={""}>Gênero</option>
                  {genres?.map((genre) => (
                    <option value={genre.value}>{genre.value}</option>
                  ))}
                </select>
                <input
                  className="text-input"
                  placeholder="Autor"
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Editora"
                  type="text"
                  name="editora"
                  value={formData.editora}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-container">
                <NumericFormat
                  className="text-input"
                  placeholder="Preço"
                  type="text"
                  prefix="R$"
                  name="preco"
                  decimalSeparator="."
                  value={formData.preco}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Número de Páginas"
                  type="number"
                  name="numero_paginas"
                  step="1"
                  pattern="\d+"
                  value={formData.numero_paginas}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Quantidade em Estoque"
                  type="number"
                  name="quantidade"
                  step="1"
                  pattern="\d+"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Data Publicação"
                  type="date"
                  name="data_publicacao"
                  value={formData.data_publicacao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-container">
                <input
                  className="text-input"
                  placeholder="URL (foto)"
                  type="text"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="ISBN"
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                className="text-input"
                placeholder="Descrição"
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
              <div className="align-right">
                <Button title={"Salvar"} onClick={saveBook} />
              </div>
            </div>
          </div>
        )}
        <div className="books-container">
          <div className="filters">
            <input
              className="text-input"
              placeholder="Nome"
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
            <IconButton
              icon="add"
              onClick={(event) => {
                setPosition({
                  x: event.clientX - elementRef.current.offsetLeft,
                  y: event.clientY - elementRef.current.offsetTop,
                });

                setSelectedBook(undefined);

                setTimeout(() => {
                  setSelectedBook({});
                  setFormData({
                    ...formData,
                    id: -1,
                    nome: "",
                    titulo_original: "",
                    genero: "",
                    idioma: "",
                    autor: "",
                    editora: "",
                    preco: "",
                    numero_paginas: "",
                    isbn: "",
                    data_publicacao: "",
                    imagem: "",
                    descricao: "",
                    quantidade: "",
                  });
                  setPosition(undefined);
                }, 1250);
              }}
            />
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

                      setFormData({
                        ...formData,
                        id: book.id,
                        nome: book.name,
                        titulo_original: book.originalTitle,
                        genero: book.genre,
                        autor: book.author,
                        numero_paginas: book.amountOfPages,
                        data_publicacao: book.publicationDate.split("T")[0],
                        idioma: book.language,
                        editora: book.editor,
                        preco: book.price,
                        imagem: book.url,
                        descricao: book.description,
                        quantidade: book.quantity,
                        isbn: book.isbn,
                      });

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

export default Seller;
