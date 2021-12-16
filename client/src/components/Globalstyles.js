import { createGlobalStyle } from "styled-components";

export const breakpoints = { tablet: "600px" };

export default createGlobalStyle`

    :root {
      --font-family: 'Raleway', sans-serif;
    }

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
        box-sizing: border-box;
        font-family: var(--font-family);
        color: #fff;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        height:100vh;
        background-color: #555;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    h1, h2, h3 {
        font-size: 28px;
    }

    //Global styles for the dhtmlx library
    .dhx_cal_light div {
        background-color: #555;
    }
    .dhx_cal_light select {
        color: #aaa;
        background-color: #555
    }
    .dhx_cal_light_wide {
        background-color: #555;
    }
    .dhx_cal_light textarea {
        background-color: #ccc;
    }
    .dhx_cal_larea .dhx_wrap_section  {
        background-color: #555;
    }
    .dhx_text_disabled  {
        color: #fff;
    }
    div.dhtmlx_modal_box.dhtmlx-alert span {
        color:#555 !important
    }
    li.MuiMenuItem-root {
        color: #555
    }
`;
