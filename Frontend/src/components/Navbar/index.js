import React, { useState, forwardRef, useEffect } from "react";
import { Button } from "../Button";
import MaskInput from "react-maskinput";
import "./styles.css";
import { Alert } from "../Alert";

function Navbar({ login, setLogin, loadingAction }) {
  const [newLogin, setNewLogin] = useState(false);
  const [loading, setLoading] = useState(loadingAction);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
    cidade: "",
    rua: "",
    bairro: "",
    numero: "",
    cep: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState();
  const [alertClosing, setAlertClosing] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function onSubmit() {
    setLoading(true);
    if (newLogin) {
      const response = await fetch(`http://localhost:11915/usuarioADD/`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (json) {
        setAlertClosing(false);
        setAlertMessage("Usuário adicionado com sucesso.");
        setAlertStatus("success");
        setTimeout(() => {
          setAlertClosing(true);
        }, 10000);
        setNewLogin(false);
      }
    } else {
      const response = await fetch(
        `http://localhost:11915/login?email=${formData.email}&senha=${formData.senha}`
      );
      const json = await response.json();
      if (json[0]) {
        setLogin(false);
        sessionStorage.setItem("user", JSON.stringify(json[0]));
      } else {
        setAlertClosing(false);
        setAlertMessage("Senha ou login incorretos.");
        setAlertStatus("error");
        setTimeout(() => {
          setAlertClosing(true);
        }, 10000);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(loadingAction);
  }, [loadingAction]);

  return (
    <div className={`navbar ${login ? "login" : ""}`}>
      {loading && (
        <div
          id="loading"
          style={{
            background: `color-mix(in srgb, var(--dark-blue) 40%, #00000066) url("../../assets/loading.svg") no-repeat center center`,
            backgroundSize: "7.5rem",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            zIndex: "100",
            top: 0,
            left: 0,
          }}
        ></div>
      )}
      <img src={"assets/Title.png"} className="title" />
      {!login ? (
        <div className="pages">
          <a href="http://localhost:3000">Livros</a>
          <a href="http://localhost:3000/pedidos">Pedidos</a>
          <a href="http://localhost:3000/carrinho-de-compras">Carrinho</a>
          <a href="http://localhost:3000/vendas">Vendas</a>
        </div>
      ) : (
        <div className="login-form">
          <Alert
            alertClosing={alertClosing}
            setAlertClosing={setAlertClosing}
            alertMessage={alertMessage}
            alertStatus={alertStatus}
          />
          <h1>{newLogin ? "Criar uma conta" : "Login"}</h1>
          <p>
            {newLogin
              ? "Insira suas informações para criar um login de acesso."
              : "Utilize seu login e senha para acessar a Plataforma."}
          </p>
          {newLogin ? (
            <>
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
                <MaskInput
                  className="text-input"
                  placeholder="CPF"
                  mask="000.000.000-00"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                className="text-input"
                placeholder="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="text-input"
                placeholder="Senha"
                type="password"
                minLength={6}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
              <MaskInput
                className="text-input"
                placeholder="Telefone"
                mask="(00) 000000000"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
              <div className="input-container">
                <input
                  className="text-input"
                  placeholder="Cidade"
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Rua"
                  type="text"
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Bairro"
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
                <input
                  className="text-input"
                  placeholder="Número"
                  type="number"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </div>
              <MaskInput
                className="text-input"
                placeholder="CEP"
                mask="00000-000"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <input
                className="text-input"
                placeholder="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="text-input"
                placeholder="Senha"
                type="password"
                minLength={6}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </>
          )}
          <div className="align-right">
            <Button title={"Entrar"} onClick={onSubmit} />
          </div>
          <p style={{ textAlign: "center" }}>
            {newLogin ? "Já" : "Ainda não"} tem uma conta?{" "}
            <em onClick={() => setNewLogin(!newLogin)}>Clique aqui</em> para{" "}
            {newLogin ? "fazer login" : "se cadastrar"}!
          </p>
        </div>
      )}
    </div>
  );
}

export { Navbar };
