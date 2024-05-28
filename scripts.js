document.addEventListener('DOMContentLoaded',() =>{
    const userForm = document.getElementById('userForm');
    const setButton = document.getElementById('setButton');
    const seatingMatrix = document.querySelector('.seating-matrix');
    const reservationDetails = document.querySelector('.reservation-details');
    const confirmButton = document.querySelector('.confirm-button');

    let currentUser =null;
    let seats=[];
    let selectedSeats=[];

    let rows=0;
    let columns=0;

    userForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        const formData=new FormData(userForm);
        const user = Object.fromEntries(formData.entries());
        user.age=parseInt(user.age);
        if (user.email==='admin@admin.com') {
            user.role='admin';
        }
        else {
            user.role='user';
        }
        currentUser=user;
        if (user.role === 'admin') {
            //document.querySelector('.selected-seats').style.display='block';
            document.querySelector('.admin-interface').style.display='block';
            alert("Welcome admin")
        }
        else {
            alert("USER IS SET\n if interface does not show up admin has not created seat plan!!")
        }
        generateMatrix(rows,columns);
    });
    setButton.addEventListener('click',()=>{
        if (currentUser.role==='admin') {
            rows = parseInt(document.getElementById('rows').value);
            columns = parseInt(document.getElementById('columns').value);
            generateMatrix(rows,columns);
            document.querySelector('.user-interface').style.display='block';
        }
        else{
            alert('Admin acces needed')
        }
    });
    confirmButton.addEventListener('click',()=>{
        confirm('Dear ' + currentUser.name + ',\nYour selected seats: ' + selectedSeats.join(', ') 
        + '\nTotal amount is $' + calculateTotalPrice() + '\nWould you like to complete your purchase?');

    });
    seatingMatrix.addEventListener('click',(event)=>{
            document.querySelector('.selected-seats').style.display = 'block';
            
        
    });
    function generateMatrix(rows,columns){
        seatingMatrix.innerHTML='';
        seats=[];
        selectedSeats=[];
        updateDetails();
        let gridRows='';
        for (let i=0;i<rows; i++){
            gridRows+='1fr ';
        }
        seatingMatrix.style.gridTemplateRows=gridRows;

        let gridColumns='';
        for (let i=0;i<columns; i++){
            gridColumns+='1fr ';
        }
        seatingMatrix.style.gridTemplateColumns=gridColumns;

        let seatId=1;
        for(let row=1; row<=rows; row++){
            for( let column=1; column<=columns; column++){
                const seat={
                    id: seatId++,
                    price:calculateSeatPrice(currentUser.age),
                    selected:false
                };
                seats.push(seat);

                const seatElement =document.createElement('div');
                seatElement.classList.add('seat');
                seatElement.textContent=seat.id;
               // seatElement.title='$'+seat.price;

                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.textContent = '$' + seat.price;
                seatElement.appendChild(tooltip);

                seatElement.addEventListener('click',()=> seatSelection(seat,seatElement));
                seatingMatrix.appendChild(seatElement);
            }
        }
        updateDetails();
    }
    function calculateSeatPrice(age){
        if(age<18) return 10;
        if(age<26) return 15;
        if(age<65) return 25;
        else {
            return 10;
        }
    }
    function seatSelection(seat,seatElement){
        seat.selected=!seat.selected;
        seatElement.classList.toggle('selected',seat.selected);
        selectedSeats=seats.filter(seat=>seat.selected).map(seat=>seat.id);
        updateDetails();
    }
    function updateDetails(){
        reservationDetails.innerHTML='';

        const nameParagraph = document.createElement('p');
        const nameText = document.createTextNode(`Name: ${currentUser.name}`);
        nameParagraph.appendChild(nameText);

        const surnameParagraph = document.createElement('p');
        const surnameText = document.createTextNode(`Surname: ${currentUser.surname}`);
        surnameParagraph.appendChild(surnameText);

        const selectedSeatsParagraph = document.createElement('p');
        const selectedSeatsText = document.createTextNode(`Selected Seats: ${selectedSeats.join(', ')}`);
        selectedSeatsParagraph.appendChild(selectedSeatsText);

        const totalPriceParagraph = document.createElement('p');
        const totalPriceText = document.createTextNode(`Total Price: $${calculateTotalPrice()}`);
        totalPriceParagraph.appendChild(totalPriceText);

        reservationDetails.appendChild(nameParagraph);
        reservationDetails.appendChild(surnameParagraph);
        reservationDetails.appendChild(selectedSeatsParagraph);
        reservationDetails.appendChild(totalPriceParagraph);

    }
    function calculateTotalPrice(){
        return seats.filter(seat=>seat.selected).reduce((total, seat)=>total+seat.price,0);
    }
});
