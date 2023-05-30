/* eslint-disable */ function $1eb0cc260df27e1b$export$27077c57cd15b0d5(type, msg) {
    $1eb0cc260df27e1b$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    setTimeout($1eb0cc260df27e1b$export$516836c6a9dfc573, 5000);
}
function $1eb0cc260df27e1b$export$516836c6a9dfc573() {
    const el = document.querySelector(".alert");
    el && el.remove();
}


async function $e33d9ff231aec008$export$596d806903d1f59e(email, password) {
    try {
        // TODO: Learn to do this the vanilla way
        const res = await axios({
            method: "POST",
            url: "http://localhost:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Login Successful");
            window.setTimeout(()=>{
                window.location.href = "/";
            }, 1000);
        }
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.response.data.message);
    }
}
async function $e33d9ff231aec008$export$a0973bcfe11b05c9() {
    try {
        // TODO: Learn to do this the vanilla way
        const res = await axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/users/logout"
        });
        if (res.data.status === "success") {
            (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Logout Successful");
            location.reload(true);
            window.setTimeout(()=>{
                window.location.href = "/";
            }, 100);
        }
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.response.data.message);
    }
}


/* eslint-disable */ function $f6b1c9ed51ec7162$export$4c5dd147b21b9176(locationsArray) {
    mapboxgl.accessToken = "pk.eyJ1IjoidGhlYWltaGVybyIsImEiOiJjbGkxYzdqdWowMTdzM3VwbW0wNWhsbWoxIn0.MU63tR9TXa5GDSTR0jS0yw";
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/theaimhero/cli23mu1400kk01pn258lcdtw",
        interactive: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locationsArray.forEach((loc)=>{
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 35
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 200,
            right: 200
        }
    });
}



async function $a7bd2b0e83ecbd10$export$f558026a994b6051(data) {
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://localhost:3000/api/v1/users/update-me",
            data: data
        });
        if (res.data.status === "success") {
            (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Settings updated successfully");
            window.location.reload(true);
        }
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.response.data.message);
    }
}
async function $a7bd2b0e83ecbd10$export$e2853351e15b7895(data) {
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://localhost:3000/api/v1/users/update-password",
            data: data
        });
        if (res.data.status === "success") (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Password updated successfully");
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.response.data.message);
    }
}


const $1cd085a7ac742057$var$loginForm = document.querySelector(".form--login");
if ($1cd085a7ac742057$var$loginForm) $1cd085a7ac742057$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $e33d9ff231aec008$export$596d806903d1f59e)(email, password);
});
const $1cd085a7ac742057$var$mapBox = document.getElementById("map");
if ($1cd085a7ac742057$var$mapBox) {
    const { locations: locations  } = $1cd085a7ac742057$var$mapBox.dataset;
    const locationsArray = JSON.parse(locations);
    (0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locationsArray);
}
const $1cd085a7ac742057$var$logoutBtn = document.querySelector(".nav__el--logout");
if ($1cd085a7ac742057$var$logoutBtn) $1cd085a7ac742057$var$logoutBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    (0, $e33d9ff231aec008$export$a0973bcfe11b05c9)();
});
const $1cd085a7ac742057$var$userDataForm = document.querySelector(".form--user-data");
if ($1cd085a7ac742057$var$userDataForm) $1cd085a7ac742057$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    console.log(document.getElementById("photo").files[0]);
    form.append("photo", document.getElementById("photo").files[0]);
    (0, $a7bd2b0e83ecbd10$export$f558026a994b6051)(form);
});
const $1cd085a7ac742057$var$userPassword = document.querySelector(".form-user-settings");
if ($1cd085a7ac742057$var$userPassword) $1cd085a7ac742057$var$userPassword.addEventListener("submit", (e)=>{
    e.preventDefault();
    const passwordConfirm = document.getElementById("password-confirm").value;
    const newPassword = document.getElementById("password").value;
    const oldPassword = document.getElementById("password-current").value;
    (0, $a7bd2b0e83ecbd10$export$e2853351e15b7895)({
        oldPassword: oldPassword,
        newPassword: newPassword,
        passwordConfirm: passwordConfirm
    });
});


//# sourceMappingURL=bundle.js.map
