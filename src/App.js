import logo from './logo.svg';
import './css/bootstrap.css';
import './app.css';
import React, { useEffect, useRef, useState } from 'react';

const sorting = (array, param="abv") => {
  if (array.length <= 1) {
    return array;
  }

  var pivot = array[0][param];
  
  var left = []; 
  var right = [];

  for (var i = 1; i < array.length; i++) {
    array[i][param] < pivot ? left.push(array[i]) : right.push(array[i]);
  }

  return sorting(left, param).concat(array[0], sorting(right, param));
};

function App(){
  const [catalog, setCatalog] = useState([]);
  const [typeSort, setSort] = useState();
  const [tempArray, setTempArray] = useState("");

  useEffect(() => {
    if(catalog.length == 0){
      fetch('https://api.punkapi.com/v2/beers')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCatalog(data);
        });  
    }else{
      const handleSortChange = event => {
        let arr = Object.assign(catalog, );
        switch(event){
          case "ABV":
            setCatalog(sorting(arr, "abv"));
            break;
          case "IBU":
            setCatalog(sorting(arr, "ibu"));
            break;
          case "EBC":
            setCatalog(sorting(arr, "ebc"));
            break;
          default: 
            break;
        }
      }
  
      handleSortChange(typeSort);
    }
  }, [typeSort]);

  return(
    <>
      <Sort sort={setSort} search={setTempArray}/>
      <Items catalog={catalog} temp={tempArray}/>
    </>
  )
}

function Sort(props){
  const formRef = useRef(null);
  const closeRef = useRef(null);
  
  const [fioState, setFIOState] = useState(true);
  const [dateState, setBIRTHDAY_DATEState] = useState(true);
  const [passwordState, setPASSWORDState] = useState(true);
  const [emailState, setEMAILState] = useState(true);

  useEffect(() => {
    if(fioState && dateState && passwordState && emailState){
      closeRef.current.click();
    }
  })
  
  function handleFormSubmit(event){
    (!/^[а-яА-Я]{1,}$/.test(formRef.current.FIO.value)) ? setFIOState(false) : setFIOState(true);
    (!/^\d{4}-\d{2}-\d{2}$/.test(formRef.current.BIRTHDAY_DATE.value)) ? setBIRTHDAY_DATEState(false) : setBIRTHDAY_DATEState(true);
    (!/(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{4,}/.test(formRef.current.PASSWORD.value)) ? setPASSWORDState(false) : setPASSWORDState(true);
    (!/^.+@.+\..+$/.test(formRef.current.EMAIL.value)) ? setEMAILState(false) : setEMAILState(true);
  }

  return(
    <>
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-8">
          <select onChange={e => props.sort(e.target.value)}>
            <option value="ABV" defaultValue>
              ABV
            </option>
            <option value="IBU">
              IBU
            </option>
            <option value="EBC">
              EBC
            </option>
          </select>
          <p>сортировка</p>
        </div>
        <div className="col-lg-4">
          <input type="text" onChange={e => props.search(e.target.value)}/>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Регистрация
          </button>
        </div>
      </div>  
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form ref={formRef}>
              <div className="form_item">
                <input type="text" name="FIO" placeholder="ФИО"/>
                <p>{(!fioState) ? "Корректно введите ФИО" : ""}</p>
              </div>
              <div className="form_item">
                <input type="date" name="BIRTHDAY_DATE" placeholder="дата рождения"/>
                <p>{(!dateState) ? "Укажите дату рождения" : ""}</p>
              </div>
              <div className="form_item">
                <input type="password" name="PASSWORD" placeholder="password"/>
                <p>{(!passwordState) ? "Пароль должен состоять минимум из 4 символов, 1 буквы и 1 цифры" : ""}</p>
              </div>
              <div className="form_item">
                <input type="email" name="EMAIL" placeholder="email"/>
                <p>{(!emailState) ? "Введите корректный email" : ""}</p>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={handleFormSubmit}>Save changes</button>
          </div>
        </div>
      </div>
    </div>  
    </>
  )
}

function Items(props){
  let filteredList = props.catalog.filter(function(item){
    return item["name"].toLowerCase().search(props.temp.toLowerCase()) !== -1;
  });
  const items = filteredList.map((element) =>
    <div className="col-lg-3" key={element.id}>
      <div className="item">
        <img src={element.image_url} className="item__img"/>
        <div className="item__name">
          {element.name}  
        </div>
        <ul className="item_ul">
          <li>abv: {element.abv}</li>
          <li>ibu: {element.ibu}</li>
          <li>ebc: {element.ebc}</li>
        </ul>
      </div>
    </div>
  );
  return(
    <div className="container">
      <div className="row items_row">
        {items}   
      </div>
    </div>
  )
}

export default App;
