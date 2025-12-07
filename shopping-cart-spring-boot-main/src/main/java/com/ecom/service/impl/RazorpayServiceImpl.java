package com.ecom.service.impl;

import com.ecom.service.RazorpayService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.json.JSONObject;

/**
 * NOTE: This implementation is MOCKED as the actual Razorpay SDK dependency is not available.
 * It assumes JSONObject is available via the pom.xml dependency added.
 */
@Service
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Override
    public String createRazorpayOrder(Double totalOrderPrice) throws Exception {
        Long amountInPaise = Math.round(totalOrderPrice * 100);

        JSONObject orderDetails = new JSONObject();
        orderDetails.put("id", "order_mock_" + System.currentTimeMillis());
        orderDetails.put("amount", amountInPaise);
        orderDetails.put("currency", currency);
        orderDetails.put("key_id", keyId);

        return orderDetails.toString();
    }

    @Override
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        // MOCK VERIFICATION: Should use Razorpay Utility in real production code.
        return razorpayOrderId != null && razorpayPaymentId != null && razorpaySignature != null;
    }
}