import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import ActionButton, { ActionOption } from './ActionButton';

const theme = { colors: { white: '#fff', tertiary: '#123456' } } as never;

const setHover = (canHover: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: canHover,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

const renderButton = (props: Partial<React.ComponentProps<typeof ActionButton>> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <ActionButton icon={<span>+</span>} hint="Ações" {...props} />
    </ThemeProvider>
  );

const options: ActionOption[] = [
  { icon: <span>a</span>, hint: 'Importar', action: vi.fn() },
  { icon: <span>b</span>, hint: 'Novo', action: vi.fn() },
];

const mainButton = () => screen.getByRole('button', { name: 'Ações' });
const menu = () => screen.queryByRole('menu');

afterEach(() => cleanup());

describe('ActionButton — touch (sem hover)', () => {
  beforeEach(() => setHover(false));

  it('um toque abre o menu', () => {
    renderButton({ options });
    expect(menu()).toBeNull();
    fireEvent.click(mainButton());
    expect(menu()).toBeInTheDocument();
    expect(mainButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('nao abre no mouseEnter (hover desligado no touch)', () => {
    renderButton({ options });
    fireEvent.mouseEnter(mainButton());
    expect(menu()).toBeNull();
  });

  it('dois toques rapidos nao causam abre/fecha — o menu fica aberto', () => {
    renderButton({ options });
    const btn = mainButton();
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(menu()).toBeInTheDocument();
  });

  it('toque -> abre; depois da janela de debounce, novo toque fecha', () => {
    vi.useFakeTimers();
    try {
      renderButton({ options });
      const btn = mainButton();
      fireEvent.click(btn);
      expect(menu()).toBeInTheDocument();
      vi.advanceTimersByTime(350);
      fireEvent.click(btn);
      expect(menu()).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('toque fora fecha o menu', () => {
    renderButton({ options });
    fireEvent.click(mainButton());
    expect(menu()).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(menu()).toBeNull();
  });

  it('Escape fecha o menu', () => {
    renderButton({ options });
    fireEvent.click(mainButton());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menu()).toBeNull();
  });

  it('clicar numa opcao dispara a acao e fecha', () => {
    const action = vi.fn();
    renderButton({ options: [{ icon: <span>x</span>, hint: 'Fazer', action }] });
    fireEvent.click(mainButton());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Fazer' }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(menu()).toBeNull();
  });
});

describe('ActionButton — desktop (com hover)', () => {
  beforeEach(() => setHover(true));

  it('mouseEnter abre e mouseLeave fecha', () => {
    renderButton({ options });
    fireEvent.mouseEnter(mainButton());
    expect(menu()).toBeInTheDocument();
    fireEvent.mouseLeave(mainButton().parentElement as HTMLElement);
    expect(menu()).toBeNull();
  });

  it('clicar no botao principal nao faz toggle do menu no desktop', () => {
    renderButton({ options });
    fireEvent.click(mainButton());
    expect(menu()).toBeNull();
  });
});

describe('ActionButton — sem opcoes / desabilitado', () => {
  beforeEach(() => setHover(false));

  it('sem options: clique chama onClick e nao ha menu', () => {
    const onClick = vi.fn();
    renderButton({ onClick });
    fireEvent.click(mainButton());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(menu()).toBeNull();
    expect(mainButton()).not.toHaveAttribute('aria-haspopup');
  });

  it('disabled: clique nao chama onClick nem abre menu', () => {
    const onClick = vi.fn();
    renderButton({ onClick, options, disabled: true });
    fireEvent.click(mainButton());
    fireEvent.mouseEnter(mainButton());
    expect(onClick).not.toHaveBeenCalled();
    expect(menu()).toBeNull();
  });
});
