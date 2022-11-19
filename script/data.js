'use strict';
//-------------- Selecting element----------------//
const inputElement = document.getElementById('input-file');

//-------------- Variable creation-------------//
const petArr = JSON.parse(getFromStorage('petArr')) ?? [];
const petsData = JSON.stringify(petArr, null, 2);

//--------------Function creation------------//
//Remove items of array
const removeItem = function (arr, items) {
  items.forEach(item => {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
  });
};

// Export Data
function exportData() {
  const exportFile = new Blob([petsData], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(exportFile, 'pets-data.json');
}

//Import Data
function handleFiles() {
  const file = inputElement.files[0];
  // console.log(file);
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const petsImport = JSON.parse(reader.result);
    // console.log(petsImport);
    const petArrCopy = [...petArr];
    const petDuplicates = [];
    petsImport.forEach((petIp, i) => {
      petArr.forEach(pet => {
        if (petIp.id === pet.id) {
          petDuplicates.push(pet);
        }
      });
    });

    removeItem(petArrCopy, petDuplicates);

    petsImport.forEach(petIp => {
      petArrCopy.push(petIp);
    });

    saveToStorage('petArr', JSON.stringify(petArrCopy));
  });
  reader.addEventListener('error', () => {
    alert('Fail to reading file!');
  });
  if (file) {
    reader.readAsText(file);
  }
}
