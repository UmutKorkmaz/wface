import { useState, useEffect } from 'react';
import { useConfiguration } from '../store';

export interface IWebViewOptions {
  hideSidebar?: boolean;
  hideTopbar?: boolean;
  hideHeader?: boolean;
  hideNavigation?: boolean;
  autoDetect?: boolean;
  cssClass?: string;
}

export interface IWebViewContext {
  isWebView: boolean;
  options: IWebViewOptions;
}

export const useWebView = (): IWebViewContext => {
  const configuration = useConfiguration();
  const [isWebView, setIsWebView] = useState<boolean>(false);
  // Get webview options from configuration or use defaults
  const webviewOptions: IWebViewOptions = {
    hideSidebar: Boolean(configuration.hideSidebar),
    hideTopbar: Boolean(configuration.hideTopbar),
    hideHeader: false,
    hideNavigation: false,
    autoDetect: true,
    cssClass: 'webview-mode',
    ...(configuration.webviewOptions || {})
  };

  useEffect(() => {
    const detectWebView = (): boolean => {
      if (!webviewOptions.autoDetect) {
        return false;
      }

      // Multiple detection methods for better compatibility
      const hasReactNativeWebView = typeof (window as any).ReactNativeWebView !== 'undefined';
      const hasNativeMessageHandler = typeof (window as any).nativeMessageHandler !== 'undefined';
      const hasWebViewUA = /wv|webview/i.test(navigator.userAgent);
      const hasMobileUA = /DigiflowMobile|Mobile|Android|iOS/i.test(navigator.userAgent);
      const hasJWTToken = typeof (window as any).JWT_TOKEN !== 'undefined';

      // Check for mobile app headers
      const hasMobileHeaders = document.querySelector('meta[name="X-Mobile-App"]')?.getAttribute('content') === 'true';

      return hasReactNativeWebView || hasNativeMessageHandler || hasWebViewUA || hasMobileUA || hasJWTToken || hasMobileHeaders;
    };

    const applyWebViewStyles = (enable: boolean) => {
      const cssClass = webviewOptions.cssClass || 'webview-mode';

      if (enable) {
        document.body.classList.add(cssClass);

        // Apply specific hiding styles based on configuration
        const style = document.createElement('style');
        style.id = 'wface-webview-styles';

        let cssRules = `
          /* WFace WebView Styles */
          body.${cssClass} {
            /* WebView mode indicator */
          }
        `;

        if (webviewOptions.hideSidebar) {
          cssRules += `
            body.${cssClass} .MuiDrawer-root {
              display: none !important;
            }
            body.${cssClass} .content-left {
              margin-left: 0 !important;
            }
            body.${cssClass} .contentShift-left {
              margin-left: 0 !important;
            }
          `;
        }        if (webviewOptions.hideTopbar) {
          cssRules += `
            body.${cssClass} .MuiAppBar-root,
            body.${cssClass} #main-app-bar,
            body.${cssClass} .wface-app-bar,
            body.${cssClass} .custom-topbar,
            body.${cssClass} .MuiToolbar-root {
              display: none !important;
            }
            body.${cssClass} main,
            body.${cssClass} .content {
              margin-top: 0 !important;
              padding-top: 0 !important;
            }
            body.${cssClass} .main-page {
              height: 100vh !important;
            }
            body.${cssClass} .main-page .content,
            body.${cssClass} .wface-no-topbar .content {
              height: 100vh !important;
              padding-top: 0 !important;
            }
            body.${cssClass} .main-page > .content,
            body.${cssClass} .wface-no-topbar > .content {
              height: calc(100vh - 0px) !important;
            }
            /* Ensure content area takes full height when topbar is hidden */
            .wface-no-topbar {
              height: 100vh !important;
            }
            .wface-no-topbar .content {
              height: 100vh !important;
              margin-top: 0 !important;
              padding-top: 0 !important;
            }
          `;
        }

        if (webviewOptions.hideHeader) {
          cssRules += `
            body.${cssClass} .header-component,
            body.${cssClass} .main-header {
              display: none !important;
            }
          `;
        }

        if (webviewOptions.hideNavigation) {
          cssRules += `
            body.${cssClass} nav,
            body.${cssClass} .navigation-component {
              display: none !important;
            }
          `;
        }

        style.textContent = cssRules;
        document.head.appendChild(style);
      } else {
        document.body.classList.remove(cssClass);

        // Remove webview styles
        const existingStyle = document.getElementById('wface-webview-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    };    const webViewDetected = detectWebView();
    setIsWebView(webViewDetected);

    // Apply styles if webview is detected OR if hideTopbar/hideSidebar is configured
    const shouldApplyStyles = webViewDetected || Boolean(webviewOptions.hideTopbar) || Boolean(webviewOptions.hideSidebar);
    applyWebViewStyles(shouldApplyStyles);

    // Cleanup function
    return () => {
      const cssClass = webviewOptions.cssClass || 'webview-mode';
      document.body.classList.remove(cssClass);
      const existingStyle = document.getElementById('wface-webview-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return {
    isWebView,
    options: webviewOptions
  };
};

export default useWebView;
