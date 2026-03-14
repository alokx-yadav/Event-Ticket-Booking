document.getElementById("payment-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const amount = category === "IIITM Student" ? 50 : 100;

  if (!category || !name || !email) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const orderRes = await fetch("https://event-ticket-booking-jaei.onrender.com/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const orderData = await orderRes.json();
    if (!orderData.id) throw new Error("Order creation failed");

    const options = {
      key: "rzp_test_b3lKIMqCuqa7bP", // Replace with real Razorpay Key ID
      amount: orderData.amount,
      currency: "INR",
      name: "IIITM Ticket Booking",
      description: "Event Ticket",
      order_id: orderData.id,
      prefill: { name, email },
      theme: { color: "#0d6efd" },
      handler: function (response) {
        const redirectURL = `success.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&payment_id=${response.razorpay_payment_id}`;
        window.location.href = redirectURL;
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    alert("Something went wrong.");
    console.error(err);
  }
});
