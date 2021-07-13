class Sort {
  constructor(name, comparisonsNumber) {
    this._name = this.validateName(name);
    this._comparisonsNumber = 0;
  }
  
  get name() {
    if (this._name === '') {
      return "Aucun nom n'a été donné à ce tri!";
    } else {
      return this._name;
    }
  }
  
  set name(newName) {
    this._name = this.validateName(newName);
  }
  
  validateName(newName) {
    if (newName !== undefined && newName !== null && ["Tri à bulles", "Tri par insertion", "Tri par sélection", "Tri rapide"].includes(newName)) {
      return newName;
    } else {
      console.log("Le nom du tri doit être l'une des valeurs suivantes : \"Tri à bulle\", \"Tri par insertion\", \"Tri par sélection\" ou \"Tri rapide\"!");
      return '';
    }
  }
  
  get comparisonsNumber() {
    return this._comparisonsNumber;
  }
  
  set comparisonsNumber(newComparisonsNumber) {
    this._comparisonsNumber = newComparisonsNumber;
  }
  
  performSort() {
    this.comparisonsNumber = this.performThisSort();
  }
  
  duplicateArray(numbersArray) {
    //Shallow copy
    return [...numbersArray];
  }
  
  getAllInfo(numbersArray) {
    return `${this.name}: ${this.comparisonsNumber} comparaison(s) - [${numbersArray}]\n`;
  }
}

class BubbleSort extends Sort {
  constructor(numbersArray) {
    super("Tri à bulles");
    this._numbersArray = super.duplicateArray(numbersArray);
  }

  get numbersArray() {
    return this._numbersArray;
  }

  set numbersArray(newNumbersArray) {
    this._numbersArray = newNumbersArray;
  }
  
  swap(numbersArray, index1, index2) {
    let temp = numbersArray[index1];
    numbersArray[index1] = numbersArray[index2];
    numbersArray[index2] = temp;
  }

  performThisSort() {
    let comparisonsNumber = 0;
    let isSorted;
    for (let i = 0; i < this._numbersArray.length; i++) {
      isSorted = true;
      for (let j = 1; j < this._numbersArray.length - i; j++) {
        comparisonsNumber++;
        //console.log(`${this._numbersArray[j]} est du type ${typeof this._numbersArray[j]}.`);
        if (this._numbersArray[j] < this._numbersArray[j - 1]) {
          this.swap(this._numbersArray, j, j - 1);
          isSorted = false;
        }
      }
      if (isSorted) {
        return comparisonsNumber;
      }
    }
    return comparisonsNumber;
  }
}

class InsertionSort extends Sort {
  constructor(numbersArray) {
    super("Tri par insertion");
    this._numbersArray = super.duplicateArray(numbersArray);
  }

  get numbersArray() {
    return this._numbersArray;
  }

  set numbersArray(newNumbersArray) {
    this._numbersArray = newNumbersArray;
  }

  performThisSort() {
    let comparisonsNumber = 0;
    for (let i = 1; i < this._numbersArray.length; i++) {
      let current = this._numbersArray[i];
      let j = i - 1;
      while (j >= 0 && this._numbersArray[j] > current) {
        comparisonsNumber++;
        this._numbersArray[j + 1] = this._numbersArray[j];
        j--;
      }
      this._numbersArray[j + 1] = current;
    }
    return comparisonsNumber;
  }
}

const fs = require("fs");

const myArgs = process.argv.slice(2);
if (myArgs.length === 0) {
  console.error("Vous devez passer un nom de fichier en argument au programme!");
} else {
  const fileName = './' + myArgs[0];
  fs.stat(fileName, (err, stats) => {
    if (err) {
      console.error(`${err}`);
    } else if (stats && stats.isFile()) {
      console.log(`Début du traitement du fichier ${fileName}...`);
      // Méthode synchrone
      try {
        const data = fs.readFileSync(fileName, 'utf8').trim().split(/\r\n|\n/);
        console.log(data);
        if (data.length === 0 || (data.length === 1 && data[0] === '')) {
          console.error(`Le fichier ${fileName} est vide!`);
        } else {
          for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
            let lineData = data[lineIndex].trim().split(/\s+/);
            if (lineData.length === 0 || (lineData.length === 1 && lineData[0] === '')) {
              console.log(`La ligne n°${lineIndex + 1} est vide.`);
            } else {
              let numbersArray = [];
              lineData.forEach((token) => {
                //console.log(`${token} est du type ${typeof token}.`);
                if (token !== undefined && token !== null && (typeof token === 'string') && !isNaN(token)) {
		  if (Number.parseInt(token) == Number.parseFloat(token)) {
                    numbersArray.push(Number.parseInt(token));
                  } else {
                    numbersArray.push(Number.parseFloat(token));
                  }
                } else {
                  console.error(`Le terme ${token} n'est pas un nombre!`);
                }
              });
              if (numbersArray.length === 0) {
                console.error(`La ligne n°${lineIndex + 1} ne contient aucun nombre!`);
              } else {
                console.log(`Début du traitement de la ligne n°${lineIndex + 1} : "${numbersArray}"...`);
                const bubble = new BubbleSort(numbersArray);
                bubble.performSort();
                console.log(bubble.getAllInfo(bubble.numbersArray), `à partir de la liste originale : "${numbersArray}"`);
                const insertion = new InsertionSort(numbersArray);
                insertion.performSort();
                console.log(insertion.getAllInfo(insertion.numbersArray), `à partir de la liste originale : "${numbersArray}"`);
              }
            }
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error(`Le fichier ${fileName} n'a pas pu être trouvé.`);
    }
  });
}
