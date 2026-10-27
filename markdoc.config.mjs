import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  tags: {
    // {% screenshot id="bookkeeping/documents-overview" caption="..." /%}
    // Images come only from the screenshot pipeline (src/assets/screenshots/**); see README.
    screenshot: {
      render: component('./src/components/Screenshot.astro'),
      selfClosing: true,
      attributes: {
        id: { type: String, required: true },
        caption: { type: String, required: false },
      },
    },
  },
});
