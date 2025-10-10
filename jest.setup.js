import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    img: 'img',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    section: 'section',
    article: 'article',
    header: 'header',
    main: 'main',
    nav: 'nav',
    ul: 'ul',
    li: 'li',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    fieldset: 'fieldset',
    legend: 'legend',
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    td: 'td',
    th: 'th',
    tfoot: 'tfoot',
    caption: 'caption',
    colgroup: 'colgroup',
    col: 'col',
    details: 'details',
    summary: 'summary',
    dialog: 'dialog',
    menu: 'menu',
    menuitem: 'menuitem',
    ol: 'ol',
    dl: 'dl',
    dt: 'dt',
    dd: 'dd',
    figure: 'figure',
    figcaption: 'figcaption',
    aside: 'aside',
    footer: 'footer',
    address: 'address',
    blockquote: 'blockquote',
    cite: 'cite',
    q: 'q',
    abbr: 'abbr',
    acronym: 'acronym',
    b: 'b',
    bdi: 'bdi',
    bdo: 'bdo',
    big: 'big',
    small: 'small',
    sub: 'sub',
    sup: 'sup',
    time: 'time',
    u: 'u',
    var: 'var',
    samp: 'samp',
    kbd: 'kbd',
    code: 'code',
    pre: 'pre',
    mark: 'mark',
    ruby: 'ruby',
    rt: 'rt',
    rp: 'rp',
    bdi: 'bdi',
    bdo: 'bdo',
    wbr: 'wbr',
    ins: 'ins',
    del: 'del',
    s: 's',
    strike: 'strike',
    tt: 'tt',
    i: 'i',
    em: 'em',
    strong: 'strong',
    dfn: 'dfn',
    a: 'a',
    area: 'area',
    base: 'base',
    br: 'br',
    hr: 'hr',
    link: 'link',
    meta: 'meta',
    param: 'param',
    source: 'source',
    track: 'track',
    wbr: 'wbr',
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: () => ({
    get: jest.fn(),
    set: jest.fn(),
    onChange: jest.fn(),
  }),
  useTransform: () => jest.fn(),
  useSpring: () => jest.fn(),
  useScroll: () => ({
    scrollX: { get: jest.fn() },
    scrollY: { get: jest.fn() },
  }),
  useViewportScroll: () => ({
    scrollX: { get: jest.fn() },
    scrollY: { get: jest.fn() },
  }),
}))

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}))

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: () => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
  }),
}))

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  })),
  QueryClient: jest.fn(() => ({
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  })),
  QueryClientProvider: ({ children }) => children,
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_NEHTW_API_URL = 'https://test.nehtw.com'
process.env.NEXT_PUBLIC_NEHTW_API_KEY = 'test-nehtw-key'