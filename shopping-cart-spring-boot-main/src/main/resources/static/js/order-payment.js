/**
 * Global function called by jQuery Validation upon successful validation.
 * @param {string} selectedPaymentType - 'COD' or 'ONLINE'
 * @param {HTMLFormElement} formElement - The DOM element of the order form.
 */
function handleOrderSubmission(selectedPaymentType, formElement) {

    // Collect ALL form data using the hidden fields for consistency
    var orderRequestData = {};

    // Iterate over all hidden inputs to build the request data model
    $(formElement).find('input[type="hidden"]').each(function() {
        orderRequestData[$(this).attr('name')] = $(this).val();
    });

    // Manually ensure payment type is set correctly in the data payload
    orderRequestData['paymentType'] = selectedPaymentType;


    if (selectedPaymentType === "ONLINE") {

        // 1. Call Backend to Create Razorpay Order
        $.ajax({
            url: '/user/create-order',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderRequestData),
            success: function(response) {
                try {
                    var razorpayOrder = JSON.parse(response);
                    startPayment(razorpayOrder, orderRequestData);
                } catch (e) {
                    console.error("Error parsing response:", response, e);
                    alert("Error: Failed to initiate payment.");
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", xhr.responseText);
                alert("Payment Initiation Failed: " + xhr.responseText);
            }
        });

    } else if (selectedPaymentType === "COD") {

        // --- COD Flow ---
        // Set the hidden input value explicitly and submit the form programmatically.
        $('#paymentTypeInput').val('COD');
        formElement.submit(); // This calls the browser's native submit, which bypasses validation hooks.

    } else {
        alert("Please select a valid payment method.");
    }
}

// 2. Payment Modal Logic (Keep this inside its own function)
function startPayment(razorpayOrder, orderRequestData) {

    var options = {
        "key": razorpayOrder.key_id,
        "amount": razorpayOrder.amount,
        "currency": razorpayOrder.currency,
        "name": "Shopping Store",
        "description": "Order Payment",
        "image": "/img/ecom.png",
        "order_id": razorpayOrder.id,
        "handler": function(response) {
            // 3. Payment Success - Redirect with verification data

            var verificationData = new URLSearchParams();
            verificationData.append('razorpay_payment_id', response.razorpay_payment_id);
            verificationData.append('razorpay_order_id', response.razorpay_order_id);
            verificationData.append('razorpay_signature', response.razorpay_signature);

            // Append the OrderRequest fields required for saving the order model
            for (const key in orderRequestData) {
                if (orderRequestData.hasOwnProperty(key)) {
                    verificationData.append(key, orderRequestData[key]);
                }
            }

            // Submits to the GET /user/verify-payment endpoint
            window.location.href = '/user/verify-payment?' + verificationData.toString();

        },
        "prefill": {
            "name": orderRequestData.firstName + " " + orderRequestData.lastName,
            "email": orderRequestData.email,
            "contact": orderRequestData.mobileNo
        },
        "notes": {
            "address": orderRequestData.address
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
        alert(response.error.description + " (" + response.error.code + ")");
        window.location.href = '/user/orders';
    });
    rzp.open();
}

$(function() {
    // This empty function ensures jQuery is ready for the global functions above.
});