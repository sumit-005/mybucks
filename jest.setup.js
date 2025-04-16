import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/',
    }),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
})); 