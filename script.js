// ===============================
// CARECONNECT SCRIPT.JS
// ===============================


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(registerForm);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password")
        };

        try {

            const response = await fetch("/api/register", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

            const result = await response.json();

            alert(result.message);

            if (result.success) {
                window.location.href = "login.html";
            }

        } catch (error) {

            console.error(error);
            alert("Server connection failed.");

        }

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(loginForm);

        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {

            const response = await fetch("/api/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

            const result = await response.json();

            alert(result.message);

            if (result.success) {

                localStorage.setItem("loggedIn", "true");

                window.location.href = "dashboard.html";
            }

        } catch (error) {

            console.error(error);
            alert("Server connection failed.");

        }

    });

}


// ===============================
// BOOK APPOINTMENT
// ===============================

const appointmentForm =
    document.getElementById("appointmentForm");

if (appointmentForm) {

    appointmentForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(appointmentForm);

        const data = {

            patient_name:
                formData.get("patient_name"),

            patient_age:
                formData.get("patient_age"),

            phone:
                formData.get("phone"),

            email:
                formData.get("email"),

            doctor:
                formData.get("doctor"),

            appointment_date:
                formData.get("appointment_date"),

            appointment_time:
                formData.get("appointment_time"),

            health_problem:
                formData.get("health_problem")
        };


        try {

            const response = await fetch("/api/appointments", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


            const result = await response.json();


            alert(result.message);


            if (result.success) {

                appointmentForm.reset();

            }

        } catch (error) {

            console.error(error);

            alert("Server connection failed.");

        }

    });

    async function cancelAppointment(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
        return;
    }

    try {

        const response = await fetch(
            "/api/appointments/" + id,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            loadAppointments();
        }

    } catch (error) {

        console.error(error);

        alert("Unable to cancel appointment.");

    }
}
    ///Find Healthcare///

    function findHealthcare() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function(position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const mapURL =
                    "https://www.google.com/maps/search/hospitals/@" +
                    latitude + "," +
                    longitude + ",14z";

                window.open(mapURL, "_blank");
            },

            function() {
                alert("Please allow location permission.");
            }
        );

    } else {
        alert("Location is not supported by this browser.");
    }
}
function searchHealthcare() {
    const location = document.getElementById("location").value;
    const type = document.getElementById("healthcareType").value;

    if (location === "") {
        alert("Please enter your location.");
        return;
    }

    const mapURL =
        "https://www.google.com/maps/search/" +
        type + "+near+" +
        encodeURIComponent(location);

    window.open(mapURL, "_blank");
}
}
// ===============================
// BOOK FROM DOCTOR CARD
// ===============================

function bookDoctor(doctorName) {

    // Appointment form मधील doctor select शोधा
    const doctorSelect = document.querySelector(
        '#appointmentForm select[name="doctor"]'
    );

    if (doctorSelect) {

        // Doctor automatically select करा
        doctorSelect.value = doctorName;

        // Appointment section वर जा
        document.getElementById("appointment").scrollIntoView({
            behavior: "smooth"
        });

    } else {
        alert("Appointment form not found.");
    }
}
// DOCTOR SEARCH
function searchDoctors() {
    const searchText = document
        .getElementById("doctorSearch")
        .value
        .toLowerCase();

    const doctorCards = document.querySelectorAll(".doctor-card");

    doctorCards.forEach(function(card) {
        const doctorInfo = card.innerText.toLowerCase();

        if (doctorInfo.includes(searchText)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}