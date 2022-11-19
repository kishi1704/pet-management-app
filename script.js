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
const healthyBtn = document.getElementById('healthy-btn');
const sideBar = document.getElementById('sidebar');

//-------------- Variable creation-------------//
let healthyCheck = false;
// const petArr = [];
const petArr = JSON.parse(getFromStorage('petArr')) ?? [];
let healthyPetArr = [];

//--------------Function creation------------//

//Capitalize word
const capitalize = str => {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
};

// checkText
const checkText = booleanText => {
  if (booleanText) {
    return 'bi bi-check-circle-fill';
  } else {
    return 'bi bi-x-circle-fill';
  }
};

// Clear Input
const clearTypeText = (...properNames) => {
  for (let i of properNames) {
    i.value = '';
  }
};
const clearInput = () => {
  clearTypeText(
    idInput,
    nameInput,
    ageInput,
    typeInput,
    weightInput,
    lengthInput,
    breedInput
  );
  colorInput.value = '#000000';
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
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

//Validation
function validateData(inputData) {
  // Check empty data
  const propertyNames = Object.keys(inputData);
  for (let i = 0; i < propertyNames.length; i++) {
    if (inputData[propertyNames[i]] === '') {
      if (propertyNames[i] === 'type' || propertyNames[i] === 'breed') {
        alert(
          `Please select ${capitalize(
            propertyNames[i]
          )}!\n (If Breed Select is blank, add breed in Breed Sidebar and select again)`
        );
        return false;
      } else {
        alert(`Please input for ${capitalize(propertyNames[i])}!`);
        return false;
      }
    }
  }

  // Duplicate ID
  for (let i = 0; i < petArr.length; i++) {
    if (inputData.id === petArr[i].id) {
      alert('ID must unique!');
      return false;
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

// Render table
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
    }</td><td><button type="button" class="btn btn-danger" onclick="deletePet('${
      pet.id
    }')">Delete</button></td>`;
    tableBodyEl.appendChild(row);
  });
}

// Table update
const updateT = () => {
  if (healthyCheck) {
    renderTableData(healthyPetArr);
  } else {
    renderTableData(petArr);
  }
};

// Delete pet
const deletePet = petId => {
  //Confirm before delete
  if (confirm('Are you sure')) {
    const index1 = petArr.findIndex(pet => pet.id === petId);
    const index2 = healthyPetArr.findIndex(pet => pet.id === petId);
    // console.log(index1, index2); //test
    petArr.splice(index1, 1);
    saveToStorage('petArr', JSON.stringify(petArr));
    healthyPetArr.splice(index2, 1);
  }
  updateT();
};

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
// ----------------------Export Function-----------//
// export { capitalize, checkText };

// ----------------------Initial Function-----------//
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
    petArr.push(data);
    clearInput();
    renderTableData(petArr);
    saveToStorage('petArr', JSON.stringify(petArr));
  }

  healthyBtn.innerText = 'Show Healthy Pet';
  healthyCheck = false;
});

// *Healthy event

healthyBtn.addEventListener('click', function () {
  if (healthyBtn.innerText === 'Show Healthy Pet') {
    healthyBtn.innerText = 'Show All Pet';
    healthyCheck = true;
  } else {
    healthyBtn.innerText = 'Show Healthy Pet';
    healthyCheck = false;
  }

  healthyPetArr = petArr.filter(
    item =>
      item.vaccinated === true &&
      item.dewormed === true &&
      item.sterilized === true
  );
  updateT();
});

// *Sidebar event
sideBar.addEventListener('click', function () {
  sideBar.classList.toggle('active');
});

//* Breed Event

breedInput.addEventListener('click', function () {
  if (!typeInput.value) alert('Please select Type!');
});

typeInput.onchange = function () {
  const breedArr = JSON.parse(getFromStorage('breedArr'))?.filter(
    breed => breed.type === `${typeInput.value}`
  );
  // console.log(breedArr);//test
  renderBreed(breedArr);
};
