const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.sold)");
const count = document.getElementById("count");
const restCount = document.getElementById("restCount");
const total = document.getElementById("total");
const totalSeats = document.getElementById("total-seats");
const seatRow = document.getElementById("seat-row");

const movieSelect = document.getElementById("movie");
const fullSeatCountElement = document.getElementById('full-seat-count');
const halfSeatCountElement = document.getElementById('half-seat-count');
const fullSeatIncrementBtn = document.getElementById('full-seat-increment');
const fullSeatDecrementBtn = document.getElementById('full-seat-decrement');
const halfSeatIncrementBtn = document.getElementById('half-seat-increment');
const halfSeatDecrementBtn = document.getElementById('half-seat-decrement');
const confirmBtn = document.getElementById('confirm-btn');

let fullSeatCount = 0;
let halfSeatCount = 0;
let seatcount =0;
let halfTicketPrice = 500;
let fullTicketPrice = 700;

populateUI();
// Define the number of rows
const numRows = 15;
const seatsPerRow = 18;

// Create seat rows dynamically
for (let i = 0; i < numRows; i++) {
  const row = document.createElement("div");
  row.classList.add("row", "seat-row");
  container.appendChild(row);

  // Create seats inside each row
  for (let j = 0; j < seatsPerRow; j++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    row.appendChild(seat);
  }
}


// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;
  totalSeats.innerText = fullSeatCount + halfSeatCount;
  count.innerText = selectedSeatsCount;
  total.innerText =  fullSeatCount* fullTicketPrice + halfSeatCount* halfTicketPrice ;
  storeSelectedSeats();
  setMovieData(movieSelect.selectedIndex, movieSelect.value);

  restCount.innerText= totalSeats.innerText - count.innerText;
}
// Get data from localstorage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
  
  // Populate full and half seat counts from local storage
  const storedFullSeatCount = localStorage.getItem("full-seat-count");
  if (storedFullSeatCount !== null) {
    fullSeatCount = parseInt(storedFullSeatCount);
    updateSeatTypeCounts();
  }

  const storedHalfSeatCount = localStorage.getItem("half-seat-count");
  if (storedHalfSeatCount !== null) {
    halfSeatCount = parseInt(storedHalfSeatCount);
    updateSeatTypeCounts();
  }
}

// Function to update seat type counts
function updateSeatTypeCounts() {
  fullSeatCountElement.innerText = fullSeatCount;
  halfSeatCountElement.innerText = halfSeatCount;
}

// Plus and minus button event listeners for full seats
fullSeatIncrementBtn.addEventListener('click', () => {
  fullSeatCount++;
  updateSeatTypeCounts();
  updateSelectedCount();
});

fullSeatDecrementBtn.addEventListener('click', () => {
  if (fullSeatCount > 0) {
    fullSeatCount--;
    updateSeatTypeCounts();
    updateSelectedCount();
  }
});

// Plus and minus button event listeners for half seats
halfSeatIncrementBtn.addEventListener('click', () => {
  halfSeatCount++;
  updateSeatTypeCounts();
  updateSelectedCount();
});

halfSeatDecrementBtn.addEventListener('click', () => {
  if (halfSeatCount > 0) {
    halfSeatCount--;
    updateSeatTypeCounts();
    updateSelectedCount();
  }
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("sold") && SelectSeat()
  ) {
    e.target.classList.toggle("selected");
    seatcount++ ; 
    updateSelectedCount();
  }
  if(e.target.classList.contains("selected")){
         seatcount-- ;
         updateSelectedCount();}

});

function SelectSeat(){
    const totalSeats= halfSeatCount +fullSeatCount;
    if(seatcount < totalSeats){
        return true;
    }
}

function storeSelectedSeats() {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    let selectedHalfSeats = 0;
    let selectedFullSeats = 0;
  
    selectedSeats.forEach((seat) => {
      if (seat.classList.contains("half")) {
        selectedHalfSeats++;
      } else if (seat.classList.contains("full")) {
        selectedFullSeats++;
      }
    });
  
    // Store selected seat counts in local storage
    localStorage.setItem("selectedHalfSeats", selectedHalfSeats);
    localStorage.setItem("selectedFullSeats", selectedFullSeats);

    // Store full and half seat counts
    localStorage.setItem("full-seat-count", fullSeatCount);
    localStorage.setItem("half-seat-count", halfSeatCount);
}

// Confirm button event listener
confirmBtn.addEventListener('click', () => {
  const movieName = movieSelect.options[movieSelect.selectedIndex].text;
  const totalPrice = parseInt(total.innerText);
  const selectedSeatCount = parseInt(count.innerText);
  const restSeatCount = parseInt(restCount.innerText);
  let text = `Are you sure you want to book ${selectedSeatCount} seat(s) for "${movieName}" for a total price of Rs.${totalPrice}?`;
  if (confirm(text) == true && (restSeatCount === 0)) {
    text = `Successfully booked`;
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    selectedSeats.forEach((seat) => {
      seat.classList.remove("selected");
      seat.classList.add("sold");
    });
    seatcount -= selectedSeats.length;
    halfSeatCount = 0;
    fullSeatCount = 0;
    updateSeatTypeCounts();
    updateSelectedCount();
    
  } else if(restSeatCount !== 0 )
 {
    text = "Booking canceled!. Check the selection";
  }
  else{
    text = "Booking canceled!";
  }
  document.getElementById("bookingStatus").innerText = text;
});


updateSelectedCount();
