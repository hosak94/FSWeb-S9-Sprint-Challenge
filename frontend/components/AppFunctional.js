import React, { useState } from "react";
import axios from "axios";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi
const theGrid = [
  "(1, 1)",
  "(2, 1)",
  "(3, 1)",
  "(1, 2)",
  "(2, 2)",
  "(3, 2)",
  "(1, 3)",
  "(2, 3)",
  "(3, 3)",
];

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [theIndex, setTheIndex] = useState(initialIndex);
  const [theStep, setTheStep] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [theEmail, setTheEmail] = useState(initialEmail);

  function getXY() {
    return theGrid[theIndex];
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  }

  function getXYMesaj(direction) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    switch (direction) {
      case "left":
        setMessage("Sola gidemezsiniz");
        break;
      case "up":
        setMessage("Yukarıya gidemezsiniz");
        break;
      case "right":
        setMessage("Sağa gidemezsiniz");
        break;
      case "down":
        setMessage("Aşağıya gidemezsiniz");
        break;
    }
  }
  function reset() {
    setTheStep(initialSteps);
    setTheIndex(initialIndex);
    setTheEmail(initialEmail);
    setMessage(initialMessage);
    // Tüm stateleri başlangıç değerlerine sıfırlamak için bu helperı kullanın.
  }

  // function sonrakiIndex(direction) {
  //   Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
  //   Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
  //   şu anki indeksi değiştirmemeli.
  // }

  function ilerle(direction) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    if (direction === "left" && !(theIndex % 3 === 0)) {
      setTheStep(theStep + 1);
      setTheIndex(theIndex - 1);
    } else if (direction === "up" && theIndex / 3 >= 1) {
      setTheStep(theStep + 1);
      setTheIndex(theIndex - 3);
    } else if (direction === "right" && !(theIndex % 3 === 2)) {
      setTheStep(theStep + 1);
      setTheIndex(theIndex + 1);
    } else if (direction === "down" && theIndex / 3 < 2) {
      setTheStep(theStep + 1);
      setTheIndex(theIndex + 3);
    } else getXYMesaj(direction);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setTheEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();

    axios
      .post("http://localhost:9000/api/result", {
        x: theGrid[theIndex][1],
        y: theGrid[theIndex][4],
        steps: theStep,
        email: theEmail,
      })
      .then(function (response) {
        setMessage(response.data.message);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      })
      .finally(function () {
        setTheEmail(initialEmail);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXY()}</h3>
        <h3 id="steps">{theStep} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === theIndex ? " active" : ""}`}
          >
            {idx === theIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => ilerle(e.target.id)} id="left">
          SOL
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="up">
          YUKARI
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="right">
          SAĞ
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="down">
          AŞAĞI
        </button>
        <button onClick={() => reset()} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={theEmail}
          onChange={(e) => onChange(e)}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
