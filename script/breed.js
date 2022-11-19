'use strict';
//-------------- Selecting element----------------//
const submitBtn = document.getElementById('submit-btn');
const breedInput = document.getElementById('input-breed');
const typeInput = document.getElementById('input-type');
const tableBodyEl = document.getElementById('tbody');

//-------------- Variable creation-------------//
const breedArr = JSON.parse(getFromStorage('breedArr')) ?? [];

//--------------Function creation------------//

//Validation Function
function validateData(inputData) {
  // Check empty data
  const propertyNames = Object.keys(inputData);
  for (let i = 0; i < propertyNames.length; i++) {
    if (inputData[propertyNames[i]] === '') {
      if (propertyNames[i] === 'type') {
        alert(`Please select Type!`);
        return false;
      } else {
        alert(`Please input for Breed!`);
        return false;
      }
    }
  }

  // Duplicate type and breed
  for (let i = 0; i < breedArr.length; i++) {
    if (
      inputData.breed === breedArr[i].breed &&
      inputData.type === breedArr[i].type
    ) {
      alert(' Duplicate breed and type!');
      return false;
    }
  }

  return true;
}

//RenderTable
function renderBreedTable(breedArr) {
  tableBodyEl.innerHTML = '';
  breedArr.forEach((breed, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${i + 1}</td><td>${breed.breed}</td><td>${
      breed.type
    }</td><td><button type="button" class="btn btn-danger" onclick="deleteBreed(${i})">Delete</button></td>`;
    tableBodyEl.appendChild(row);
  });
}

//Clear Input
const clearInput = () => {
  breedInput.value = '';
  typeInput.value = '';
};

//Delete Data
const deleteBreed = index => {
  breedArr.splice(index, 1);
  renderBreedTable(breedArr);
  saveToStorage('breedArr', JSON.stringify(breedArr));
};
//-----------------Initial Function------------//
renderBreedTable(breedArr);
//---------------------Event------------------//
//* Submit event
submitBtn.addEventListener('click', function () {
  const data = {
    breed: breedInput.value,
    type: typeInput.value,
  };
  const validate = validateData(data);
  if (validate) {
    breedArr.push(data);
    clearInput();
    renderBreedTable(breedArr);
    saveToStorage('breedArr', JSON.stringify(breedArr));
  }
});
