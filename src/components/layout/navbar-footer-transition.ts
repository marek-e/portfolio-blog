type SharedElement = {
  source: HTMLElement | SVGSVGElement;
  destination: HTMLElement;
  target: HTMLAnchorElement;
};

export function initNavbarFooterTransition() {
  const navbar = document.querySelector<HTMLElement>('[data-floating-navbar]');
  const footer = document.getElementById('footer');
  if (!navbar || !footer) return;

  const destinations = [...footer.querySelectorAll<HTMLAnchorElement>('[data-footer-link]')];
  const pairs: SharedElement[] = [
    ...navbar.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'),
  ].flatMap((link) => {
    const target = destinations.find((destination) => destination.href === link.href);
    const source = link.querySelector<HTMLElement>('[data-nav-label]');
    const destination = target?.querySelector<HTMLElement>('[data-footer-label]');
    return source && destination && target ? [{ source, destination, target }] : [];
  });
  const logoSource = navbar.querySelector<SVGSVGElement>('[data-nav-logo-link] svg');
  const logoDestination = footer.querySelector<HTMLImageElement>('[data-footer-logo]');
  const logoTarget = logoDestination?.closest('a');
  if (logoSource && logoDestination && logoTarget) {
    pairs.unshift({ source: logoSource, destination: logoDestination, target: logoTarget });
  }
  const desktop = window.matchMedia('(min-width: 768px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let hidden: boolean | undefined;
  let keyboardScrolling = false;
  let frame = 0;
  let transfer:
    | {
        layer: HTMLElement;
        copies: HTMLAnchorElement[];
        animations: Animation[];
        toFooter: boolean;
      }
    | undefined;

  const syncVisibility = () => {
    pairs.forEach(({ source, destination }) => {
      if (!desktop.matches) {
        source.style.removeProperty('opacity');
        destination.style.removeProperty('opacity');
      } else {
        source.style.opacity = transfer || hidden ? '0' : '';
        destination.style.opacity = transfer || !hidden ? '0' : '';
      }
    });
  };

  const clearTransfer = () => {
    transfer?.layer.remove();
    transfer?.animations.forEach((animation) => animation.cancel());
    transfer = undefined;
    syncVisibility();
  };

  const measure = (toFooter: boolean) =>
    pairs.map(({ source, destination }) => {
      const from = source.getBoundingClientRect();
      const to = destination.getBoundingClientRect();
      const scale = from.width / to.width;
      const x = toFooter ? window.scrollX : 0;
      const y = toFooter ? window.scrollY : 0;
      return {
        navbar: `translate3d(${from.left + x}px, ${from.top + y + (from.height - to.height * scale) / 2}px, 0) scale(${scale})`,
        footer: `translate3d(${to.left + x}px, ${to.top + y}px, 0) scale(1)`,
      };
    });

  const createCopies = (toFooter: boolean) => {
    const layer = document.createElement('div');
    layer.setAttribute('data-nav-transfer', '');
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {
      position: toFooter ? 'absolute' : 'fixed',
      inset: '0',
      zIndex: '60',
      pointerEvents: 'none',
    });

    const copies = pairs.map(({ source, destination, target }) => {
      const clone = document.createElement('a');
      const style = getComputedStyle(destination);
      clone.href = target.href;
      clone.target = target.target;
      clone.rel = target.rel;
      clone.tabIndex = -1;
      Object.assign(clone.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        font: style.font,
        letterSpacing: style.letterSpacing,
        color: style.color,
        whiteSpace: 'nowrap',
        transformOrigin: 'top left',
        pointerEvents: 'auto',
      });

      if (destination instanceof HTMLImageElement) {
        const image = new Image();
        const rect = destination.getBoundingClientRect();
        image.src = destination.currentSrc || destination.src;
        image.alt = '';
        image.style.width = '100%';
        image.style.height = '100%';
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.append(image);
      } else {
        clone.textContent = destination.textContent;
      }

      clone.addEventListener('pointerdown', (event) => event.preventDefault());
      layer.append(clone);
      source.style.opacity = '0';
      destination.style.opacity = '0';

      return clone;
    });

    document.body.append(layer);
    return { layer, copies };
  };

  const transferElements = (toFooter: boolean) => {
    const positions = measure(toFooter);
    const coordinateChange = Number(toFooter) - Number(transfer?.toFooter ?? toFooter);
    const from = transfer
      ? transfer.copies.map((copy) => {
          const transform = new DOMMatrix(getComputedStyle(copy).transform);
          transform.m41 += coordinateChange * window.scrollX;
          transform.m42 += coordinateChange * window.scrollY;
          return { transform: transform.toString() };
        })
      : positions.map((position) => ({ transform: toFooter ? position.navbar : position.footer }));
    const { layer, copies } = transfer ?? createCopies(toFooter);
    copies.forEach((copy, index) => {
      copy.style.transform = from[index].transform;
    });
    transfer?.animations.forEach((animation) => animation.cancel());
    layer.style.position = toFooter ? 'absolute' : 'fixed';

    const animations = copies.map((copy, index) =>
      copy.animate(
        [from[index], { transform: toFooter ? positions[index].footer : positions[index].navbar }],
        {
          duration: 280,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'both',
        }
      )
    );
    const current = { layer, copies, animations, toFooter };
    transfer = current;
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (transfer === current) clearTransfer();
      })
      .catch(() => {});
  };

  const update = (animate = true) => {
    frame = 0;
    const footerTop = footer.getBoundingClientRect().top;
    const footerFocused = footer.contains(document.activeElement);
    const nextHidden =
      desktop.matches &&
      (footerTop <= window.innerHeight / 2 || (footerFocused && footerTop < window.innerHeight)) &&
      !navbar.contains(document.activeElement);
    const canTransfer =
      animate && desktop.matches && !reducedMotion.matches && !keyboardScrolling && !footerFocused;

    if (!canTransfer) clearTransfer();

    if (nextHidden !== hidden) {
      if (hidden !== undefined && canTransfer && pairs.length) transferElements(nextHidden);
      hidden = nextHidden;
      navbar.toggleAttribute('data-footer-hidden', hidden);
      navbar.inert = hidden;
    }

    syncVisibility();
  };

  const scheduleUpdate = () => {
    if (!frame) frame = requestAnimationFrame(() => update());
  };
  const reset = () => {
    cancelAnimationFrame(frame);
    update(false);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
      keyboardScrolling = true;
      navbar.style.transitionDuration = '0ms';
      clearTransfer();
    }
  };
  const onPointerInput = () => {
    keyboardScrolling = false;
    navbar.style.removeProperty('transition-duration');
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', reset);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('wheel', onPointerInput, { passive: true });
  window.addEventListener('pointerdown', onPointerInput, { passive: true });
  document.addEventListener('focusin', reset);
  document.addEventListener('focusout', scheduleUpdate);
  desktop.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  update(false);

  return () => {
    cancelAnimationFrame(frame);
    clearTransfer();
    pairs.forEach(({ source, destination }) => {
      source.style.removeProperty('opacity');
      destination.style.removeProperty('opacity');
    });
    navbar.style.removeProperty('transition-duration');
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', reset);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('wheel', onPointerInput);
    window.removeEventListener('pointerdown', onPointerInput);
    document.removeEventListener('focusin', reset);
    document.removeEventListener('focusout', scheduleUpdate);
    desktop.removeEventListener('change', reset);
    reducedMotion.removeEventListener('change', reset);
  };
}
