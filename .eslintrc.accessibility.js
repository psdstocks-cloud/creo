module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
    'jsx-a11y/valid-aria-props': 'error',
    'jsx-a11y/valid-aria-role': 'error',
    'jsx-a11y/valid-aria-values': 'error',
    'jsx-a11y/valid-html-semantic': 'error',
    'jsx-a11y/valid-lang': 'error',
    'jsx-a11y/valid-scope': 'error',
    
    // Custom accessibility rules
    'jsx-a11y/alt-text': ['error', {
      elements: ['img', 'object', 'area', 'input[type="image"]'],
      img: ['Image'],
      object: ['Object'],
      area: ['Area'],
      'input[type="image"]': ['InputImage']
    }],
    
    'jsx-a11y/label-has-associated-control': ['error', {
      labelComponents: ['Label'],
      labelAttributes: ['htmlFor'],
      controlComponents: ['Input', 'Select', 'Textarea', 'Checkbox', 'Radio'],
      assert: 'both',
      depth: 25
    }],
    
    'jsx-a11y/click-events-have-key-events': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp']
    }],
    
    'jsx-a11y/no-static-element-interactions': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp']
    }],
    
    'jsx-a11y/interactive-supports-focus': ['error', {
      tabbable: ['button', 'input', 'select', 'textarea', 'a[href]', 'area[href]', 'iframe', 'object', 'embed', '[tabindex]', '[contenteditable]']
    }],
    
    'jsx-a11y/no-noninteractive-element-interactions': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp'],
      alert: ['onKeyDown', 'onKeyUp'],
      body: ['onError', 'onLoad'],
      dialog: ['onKeyDown', 'onKeyUp'],
      iframe: ['onError', 'onLoad'],
      img: ['onError', 'onLoad']
    }],
    
    'jsx-a11y/no-noninteractive-element-to-interactive-role': ['error', {
      tr: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row', 'rowheader', 'switch', 'tab', 'textbox', 'treeitem']
    }],
    
    'jsx-a11y/no-noninteractive-tabindex': ['error', {
      tags: [],
      roles: ['tabpanel'],
      allowExpressionValues: true
    }],
    
    'jsx-a11y/role-has-required-aria-props': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/role-supports-aria-props': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/valid-aria-props': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/valid-aria-role': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/valid-aria-values': ['error', {
      allowedInvalidValues: []
    }],
    
    'jsx-a11y/valid-html-semantic': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/valid-lang': ['error', {
      allowedLanguages: ['en', 'ar']
    }],
    
    'jsx-a11y/valid-scope': ['error', {
      allowedInvalidScopes: []
    }],
    
    // Additional custom rules
    'jsx-a11y/alt-text': ['error', {
      elements: ['img', 'object', 'area', 'input[type="image"]'],
      img: ['Image'],
      object: ['Object'],
      area: ['Area'],
      'input[type="image"]': ['InputImage']
    }],
    
    'jsx-a11y/anchor-has-content': ['error', {
      components: ['Link'],
      specialLink: ['href']
    }],
    
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['href'],
      aspects: ['noHref', 'invalidHref', 'preferButton']
    }],
    
    'jsx-a11y/aria-activedescendant-has-tabindex': ['error', {
      allowedInvalidRoles: []
    }],
    
    'jsx-a11y/aria-props': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/aria-proptypes': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/aria-role': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/aria-unsupported-elements': ['error', {
      allowedInvalidRoles: []
    }],
    
    'jsx-a11y/click-events-have-key-events': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp']
    }],
    
    'jsx-a11y/heading-has-content': ['error', {
      components: ['Heading'],
      allowedRoles: ['presentation']
    }],
    
    'jsx-a11y/html-has-lang': ['error', {
      allowedLanguages: ['en', 'ar']
    }],
    
    'jsx-a11y/iframe-has-title': ['error', {
      allowedTitles: []
    }],
    
    'jsx-a11y/img-redundant-alt': ['error', {
      allowedWords: ['image', 'photo', 'picture']
    }],
    
    'jsx-a11y/interactive-supports-focus': ['error', {
      tabbable: ['button', 'input', 'select', 'textarea', 'a[href]', 'area[href]', 'iframe', 'object', 'embed', '[tabindex]', '[contenteditable]']
    }],
    
    'jsx-a11y/label-has-associated-control': ['error', {
      labelComponents: ['Label'],
      labelAttributes: ['htmlFor'],
      controlComponents: ['Input', 'Select', 'Textarea', 'Checkbox', 'Radio'],
      assert: 'both',
      depth: 25
    }],
    
    'jsx-a11y/media-has-caption': ['error', {
      audio: ['Audio'],
      video: ['Video'],
      track: ['Track']
    }],
    
    'jsx-a11y/mouse-events-have-key-events': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp']
    }],
    
    'jsx-a11y/no-access-key': ['error', {
      allowedKeys: []
    }],
    
    'jsx-a11y/no-autofocus': ['error', {
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/no-distracting-elements': ['error', {
      elements: ['marquee', 'blink']
    }],
    
    'jsx-a11y/no-interactive-element-to-noninteractive-role': ['error', {
      tr: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row', 'rowheader', 'switch', 'tab', 'textbox', 'treeitem']
    }],
    
    'jsx-a11y/no-noninteractive-element-interactions': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp'],
      alert: ['onKeyDown', 'onKeyUp'],
      body: ['onError', 'onLoad'],
      dialog: ['onKeyDown', 'onKeyUp'],
      iframe: ['onError', 'onLoad'],
      img: ['onError', 'onLoad']
    }],
    
    'jsx-a11y/no-noninteractive-element-to-interactive-role': ['error', {
      tr: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row', 'rowheader', 'switch', 'tab', 'textbox', 'treeitem']
    }],
    
    'jsx-a11y/no-noninteractive-tabindex': ['error', {
      tags: [],
      roles: ['tabpanel'],
      allowExpressionValues: true
    }],
    
    'jsx-a11y/no-redundant-roles': ['error', {
      allowedRoles: []
    }],
    
    'jsx-a11y/no-static-element-interactions': ['error', {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyDown', 'onKeyUp']
    }],
    
    'jsx-a11y/role-has-required-aria-props': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/role-supports-aria-props': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/scope': ['error', {
      allowedInvalidScopes: []
    }],
    
    'jsx-a11y/tabindex-no-positive': ['error', {
      allowedInvalidTabindex: []
    }],
    
    'jsx-a11y/valid-aria-props': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/valid-aria-role': ['error', {
      allowedInvalidRoles: [],
      ignoreNonDOM: true
    }],
    
    'jsx-a11y/valid-aria-values': ['error', {
      allowedInvalidValues: []
    }],
    
    'jsx-a11y/valid-html-semantic': ['error', {
      allowedInvalidProps: []
    }],
    
    'jsx-a11y/valid-lang': ['error', {
      allowedLanguages: ['en', 'ar']
    }],
    
    'jsx-a11y/valid-scope': ['error', {
      allowedInvalidScopes: []
    }]
  }
}
