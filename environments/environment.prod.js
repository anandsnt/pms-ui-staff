module.exports = {
    production: true,
    gtmSnippet: [
        '<!-- Google Tag Manager -->\n' +
        '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n' +
        'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n' +
        'j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n' +
        '\'https://www.googletagmanager.com/gtm.js?id=\'+i+' +
        'dl+ \'&gtm_auth=F2NMdzMaXn4pYQJqWhO3Hg&gtm_preview=env-28&gtm_cookies_win=x\';f.parentNode.insertBefore(j,f);\n' +
        '})(window,document,\'script\',\'dataLayer\',\'GTM-PCL4D9D\');</script>\n' +
        '<!-- End Google Tag Manager -->',

        '<!-- Google Tag Manager (noscript) -->\n' +
        '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCL4D9D&' +
        'gtm_auth=F2NMdzMaXn4pYQJqWhO3Hg&gtm_preview=env-28&gtm_cookies_win=x"\n' +
        'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' +
        '<!-- End Google Tag Manager (noscript) -->'
    ]
};
