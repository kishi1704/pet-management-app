'use strict';
//-------------- Selecting element----------------//
const findBtn = document.getElementById('find-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const typeInput = document.getElementById('input-type');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const tableBodyEl = document.getElementById('tbody');

//-------------- Variable creation-------------//
const petArr = JSON.parse(getFromStorage('petArr')) ?? [];
const breedArr = JSON.parse(getFromStorage('breedArr')) ?? [];

//--------------Function creation------------//

//renderBreed Function

function renderBreed(breedArr) {
  breedInput.innerHTML =
    '<option value="" disabled selected>Select Breed</option>';
  const nameBreeds = [];
  breedArr?.forEach(name => {
    nameBreeds.push(name.breed);
  });
  const nameBreedSets = [...new Set(nameBreeds)];
  nameBreedSets?.forEach(name => {
    const option = document.createElement('option');
    option.value = `${name}`;
    option.innerHTML = `${name}`;
    breedInput.appendChild(option);
  });
}

//Find Function
const findPet = function (data) {
  let petArrTrue;
  petArrTrue = petArr.filter(
    pet =>
      (data.vaccinated === true ? data.vaccinated === pet.vaccinated : true) &&
      (data.dewormed === true ? data.dewormed === pet.dewormed : true) &&
      (data.sterilized === true ? data.sterilized === pet.sterilized : true) &&
      (data.type === '' ? true : data.type === pet.type) &&
      (data.breed === '' ? true : data.breed === pet.breed) &&
      (data.id === ''
        ? true
        : pet.id.toLowerCase().includes(data.id.toLowerCase())) &&
      (data.namePet === ''
        ? true
        : pet.namePet.toLowerCase().includes(data.namePet.toLowerCase()))
  );

  return petArrTrue;
};

// checkText
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
    }</td>`;
    tableBodyEl.appendChild(row);
  });
}

// Clear Input
const clearTypeText = (...properNames) => {
  properNames.forEach(proper => (proper.value = ''));
};

const clearTypeCheck = (...properNames) => {
  properNames.forEach(proper => (proper.checked = false));
};
const clearInput = () => {
  clearTypeText(idInput, nameInput, typeInput, breedInput);
  clearTypeCheck(vaccinatedInput, dewormedInput, sterilizedInput);
};
//----------------------Initial Function-----------//
renderBreed(breedArr);

//---------------------Event------------------//

//* Find event

findBtn.addEventListener('click', function () {
  const data = {
    id: idInput.value,
    namePet: nameInput.value,
    type: typeInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
  };

  tableBodyEl.innerHTML = '';

  // console.log(data);
  const foundPet = findPet(data);
  console.log(foundPet);
  if (foundPet.length === 0) alert('Not found!');
  else {
    renderTableData(foundPet);
    clearInput();
  }
});
