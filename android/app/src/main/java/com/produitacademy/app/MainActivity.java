package com.produitacademy.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        // Desktop view forced settings removed for responsive mobile layout
        if (getBridge() != null && getBridge().getWebView() != null) {
            // Keep any essential configs here if needed in future
        }
    }
}
