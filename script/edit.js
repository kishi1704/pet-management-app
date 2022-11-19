'use strict';
//-------------- Selecting element----------------//
const submitBtn = document.getElementById('submit-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const ageInput = document.getElementById('input-age');
const typeInput = document.getElementById('input-type');
const weightInput = document.getElementById('input-weight');
const lengthInput = document.getElementById('input-length');
const colorInput = document.getElementById('input-color-1');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const tableBodyEl = document.getElementById('tbody');
const containerFormEL = document.getElementById('container-form');

//-------------- Variable creation-------------//
const petArr = JSON.parse(getFromStorage('petArr')) ?? [];

//--------------Function Import----------------//
// import { capitalize } from '../script.js'; // Em muốn dùng kiểu này nhưng gặp lỗi.Nếu được anh chỉ cách fix với ạ

//--------------Function creation------------//

// Capitalize word
const capitalize = str => {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
};

//SubFunction Validation(Age,Weight,Length)
function checkValue(inputData, proper, min, max) {
  if (inputData[proper] < min || inputData[proper] > max) {
    alert(`${capitalize(proper)} must be between ${min} and ${max}!`);
    return false;
  } else {
    return true;
  }
}

//Validate data function
function validateData(inputData) {
  // Check empty data
  const propertyNames = Object.keys(inputData);
  for (let i = 0; i < propertyNames.length; i++) {
    if (inputData[propertyNames[i]] === '') {
      if (propertyNames[i] === 'type' || propertyNames[i] === 'breed') {
        alert(`Please select ${capitalize(propertyNames[i])}!`);
        return false;
      } else {
        alert(`Please input for ${capitalize(propertyNames[i])}!`);
        return false;
      }
    }
  }

  // Age,Weight,Length validation
  if (
    !checkValue(inputData, 'age', 1, 15) ||
    !checkValue(inputData, 'weight', 1, 15) ||
    !checkValue(inputData, 'lengthPet', 1, 100)
  )
    return false;

  // return true if everything is correct
  return true;
}

//checkText Function
const checkText = booleanText => {
  if (booleanText) {
    return 'bi bi-check-circle-fill';
  } else {
    return 'bi bi-x-circle-fill';
  }
};

//Render Table
function renderTableData(petArr) {
  tableBodyEl.innerHTML = '';
  petArr.forEach(pet => {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope="row">${pet.id}</th><td>${pet.namePet}</td><td>${
      pet.age
    }</td><td>${pet.type}</td><td>${pet.weight} kg</td><td>${
      pet.lengthPet
    } cm</td><td>${
      pet.breed
    }</td><td><i class="bi bi-square-fill" style="color: ${
      pet.color
    }"></i></td><td><i class="${checkText(
      pet.vaccinated
    )}"></i></td><td><i class="${checkText(
      pet.dewormed
    )}"></i></td><td><i class="${checkText(pet.sterilized)}"></i></td><td>${
      pet.date
    }</td><td><button type="button" class="btn btn-warning" onclick="startEditPet('${
      pet.id
    }')">Edit</button></td>`;
    tableBodyEl.appendChild(row);
  });
}

//renderBreed Function

function renderBreed(breedArr) {
  breedInput.innerHTML =
    '<option value="" disabled selected>Select Breed</option>';
  breedArr?.forEach(name => {
    const option = document.createElement('option');
    option.value = `${name.breed}`;
    option.innerHTML = `${name.breed}`;
    breedInput.appendChild(option);
  });
}

//startEditPet

const startEditPet = function (id) {
  containerFormEL.classList.toggle('hide');

  const pet = JSON.parse(getFromStorage('petArr'))?.filter(
    pet => pet.id === `${id}`
  )[0];

  const breedArr = JSON.parse(getFromStorage('breedArr'))?.filter(
    breed => breed.type === `${pet.type}`
  );

  renderBreed(breedArr);
  ({
    id: idInput.value,
    namePet: nameInput.value,
    age: ageInput.value,
    type: typeInput.value,
    weight: weightInput.value,
    lengthPet: lengthInput.value,
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
  } = pet);
};

//----------------------Initial Function-----------//
renderTableData(petArr);
//---------------------Event------------------//
//* Submit event

submitBtn.addEventListener('click', function () {
  const data = {
    id: idInput.value,
    namePet: nameInput.value,
    age: ageInput.value,
    type: typeInput.value,
    weight: weightInput.value,
    lengthPet: lengthInput.value,
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    date: new Date().toLocaleDateString('en-GB'),
  };

  // console.log(data); //test
  const validate = validateData(data);
  // console.log(validate); //test
  if (validate) {
    const index = petArr.findIndex(pet => pet.id === data.id);
    petArr.splice(index, 1);
    petArr.push(data);
    containerFormEL.classList.toggle('hide');
    renderTableData(petArr);
    saveToStorage('petArr', JSON.stringify(petArr));
  }
});

//Breed event
typeInput.onchange = function () {
  const breedArr = JSON.parse(getFromStorage('breedArr'))?.filter(
    breed => breed.type === `${typeInput.value}`
  );
  // console.log(breedArr);//test
  renderBreed(breedArr);
};
