#!/usr/bin/env python3
"""
Camada 3 (tools/) — Processador Determinístico de Ativos Visuais v2 (BLACK Treinamentos)
Refinamento sem artefatos:
1. Suavização contínua (sem limiar brusco/pontilhados) do canal verde excedente nas fotos dos 5 instrutores,
   mais vinheta lateral escura suave (#050505) para eliminar qualquer letra da arte antiga na borda direita.
2. Recorte limpo do Socorrista do Hero (sem texto à esquerda e sem borda do celular à direita) com fusão
   em degradê preto (#050505) pronto para o Hero Section.
3. Recorte alinhado das 3 fotos dos cards de treinamentos do mockup (sem faixa branca superior).
"""

import shutil
from pathlib import Path
from PIL import Image, ImageEnhance

ROOT_DIR = Path(__file__).resolve().parent.parent
REF_DIR = ROOT_DIR / "referencias"
PROP_DIR = Path(r"c:\Users\Nitro\Downloads\proposta-black")
OUT_DIR = ROOT_DIR / "public" / "assets"


def make_logo_assets():
    logo_src = REF_DIR / "logo black.jpeg"
    if not logo_src.exists():
        logo_src = PROP_DIR / "logo black.jpeg"

    im = Image.open(logo_src).convert("RGB")
    # Recorta a marca BLACK TREINAMENTOS RESGATE & APH em fundo #000000 puro
    cropped = im.crop((50, 360, 1204, 885))
    cropped.save(OUT_DIR / "logo-black-cropped.png")

    # Versão RGBA com transparência proporcional à luminância (sem borda escura)
    rgba = cropped.convert("RGBA")
    pixels = rgba.load()
    cw, ch = rgba.size
    for y in range(ch):
        for x in range(cw):
            r, g, b, _ = pixels[x, y]
            lum = max(r, g, b)
            if lum < 15:
                pixels[x, y] = (0, 0, 0, 0)
            elif lum < 90:
                alpha = int((lum - 15) / 75.0 * 255)
                scale = 255.0 / max(lum, 1)
                pixels[x, y] = (
                    min(255, int(r * scale)),
                    min(255, int(g * scale)),
                    min(255, int(b * scale)),
                    alpha,
                )
    rgba.save(OUT_DIR / "logo-black-transparent.png")
    shutil.copy2(logo_src, OUT_DIR / "logo-black-original.jpeg")


def smooth_cinematic_grade(im: Image.Image, fade_right_px: int = 45) -> Image.Image:
    """
    Remove de forma 100% contínua (sem pontilhados) qualquer excesso de verde-limão
    limitando suavemente o canal G ao envelope natural (max(R, B)) e aplica
    uma vinheta escura suave na borda direita e superior/inferior.
    """
    rgb = im.convert("RGB")
    pixels = rgb.load()
    w, h = rgb.size
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Envelope contínuo: remove apenas o excesso artificial de verde sobre R/B
            rb_max = max(r, b)
            if g > rb_max:
                excess = g - rb_max
                g = rb_max - int(excess * 0.15)
                r = min(255, r + int(excess * 0.08))
                g = max(0, g)

            # Vinheta suave na borda direita para cobrir qualquer resquício de tipografia lateral
            factor = 1.0
            if fade_right_px > 0 and x > w - fade_right_px:
                t = (x - (w - fade_right_px)) / float(fade_right_px)
                factor *= (1.0 - t * t * 0.92)
            # Vinheta sutil no topo
            if y < 28:
                t_top = (28 - y) / 28.0
                factor *= (1.0 - t_top * 0.7)

            pixels[x, y] = (
                int(r * factor),
                int(g * factor),
                int(b * factor),
            )
    return rgb


def make_instructor_assets():
    # Coordenadas ajustadas (x_end <= 392) para não pegar nenhuma letra do título à direita
    instructors = [
        ("cleverson", "instrutor black.jpeg", (12, 115, 392, 745), (12, 115, 392, 1115)),
        ("iverson", "instrutor iverson.jpeg", (8, 55, 388, 745), (8, 55, 388, 1395)),
        ("erika", "instrutor erika.jpeg", (8, 60, 388, 745), (8, 60, 388, 1395)),
        ("wagner", "instrutor wagner.jpeg", (8, 55, 388, 745), (8, 55, 388, 1395)),
        ("salete", "instrutor salete.jpeg", (8, 60, 388, 745), (8, 60, 388, 1395)),
    ]

    for slug, filename, bust_box, full_box in instructors:
        src = REF_DIR / filename
        if not src.exists():
            src = PROP_DIR / filename
        if not src.exists():
            continue

        im = Image.open(src).convert("RGB")
        bust = smooth_cinematic_grade(im.crop(bust_box), fade_right_px=38)
        bust.save(OUT_DIR / f"instrutor-{slug}-portrait.jpg", quality=95)

        full_body = smooth_cinematic_grade(im.crop(full_box), fade_right_px=38)
        full_body.save(OUT_DIR / f"instrutor-{slug}-full.jpg", quality=93)

        shutil.copy2(src, OUT_DIR / f"instrutor-{slug}-card-original.jpeg")

    equipe_src = REF_DIR / "equipe de instrutor.jpeg"
    if equipe_src.exists():
        eq_im = Image.open(equipe_src).convert("RGB")
        eq_group = smooth_cinematic_grade(eq_im.crop((0, 185, 1247, 695)), fade_right_px=0)
        eq_group.save(OUT_DIR / "equipe-5-instrutores-banner.jpg", quality=95)
        shutil.copy2(equipe_src, OUT_DIR / "equipe-original.jpeg")


def make_hero_and_course_assets():
    mockup_lp = PROP_DIR / "Mockup da Landing Page APH Treinamentos.png"
    proposta_full = PROP_DIR / "Proposta Completa APH Treinamentos.png"
    cartaz_src = REF_DIR / "infos complementares curso.jpeg"
    jornal_src = REF_DIR / "imagem jornal.png"

    if cartaz_src.exists():
        shutil.copy2(cartaz_src, OUT_DIR / "cartaz-socorrista.jpeg")
    if jornal_src.exists():
        shutil.copy2(jornal_src, OUT_DIR / "jornal-socorrista.png")

    if mockup_lp.exists():
        im_lp = Image.open(mockup_lp).convert("RGB")
        # Recorte do socorrista do Hero sem o texto da esquerda (x >= 492) e antes do celular à direita (x <= 875)
        hero_crop = im_lp.crop((492, 168, 875, 505))
        hw, hh = hero_crop.size
        hpix = hero_crop.load()
        for y in range(hh):
            for x in range(hw):
                r, g, b = hpix[x, y]
                factor = 1.0
                # Degradê suave à esquerda para fundir com o fundo #050505 do Hero
                if x < 65:
                    t = (65 - x) / 65.0
                    factor *= (1.0 - t * t)
                # Degradê suave no canto inferior direito onde encostava a moldura do celular
                if x > hw - 42 and y > hh - 165:
                    tx = (x - (hw - 42)) / 42.0
                    ty = (y - (hh - 165)) / 165.0
                    factor *= max(0.0, 1.0 - tx * max(0.2, ty) * 1.15)
                # Topo e base suaves
                if y < 18:
                    factor *= (y / 18.0)
                if y > hh - 16:
                    factor *= ((hh - y) / 16.0)
                hpix[x, y] = (
                    max(5, int(r * factor)),
                    max(5, int(g * factor)),
                    max(5, int(b * factor)),
                )
        hero_crop.save(OUT_DIR / "hero-socorrista-ref.jpg", quality=96)

        # Miniaturas dos 3 cards de cursos no mockup (sem faixa branca superior: y: 686..772)
        c1 = im_lp.crop((174, 686, 396, 773))
        c1.save(OUT_DIR / "curso-aph-rcp.jpg", quality=95)

        c2 = im_lp.crop((417, 684, 624, 770))
        c2.save(OUT_DIR / "curso-combate-incendio.jpg", quality=95)

        c3 = im_lp.crop((644, 680, 843, 765))
        c3.save(OUT_DIR / "curso-imobilizacao-resgate.jpg", quality=95)

    # Também extrai o socorrista em alta resolução da lateral esquerda da Proposta Completa
    if proposta_full.exists():
        im_prop = Image.open(proposta_full).convert("RGB")
        socorrista_hd = im_prop.crop((0, 125, 310, 695))
        socorrista_hd.save(OUT_DIR / "socorrista-destaque-lateral.jpg", quality=95)


if __name__ == "__main__":
    make_logo_assets()
    make_instructor_assets()
    make_hero_and_course_assets()
    print("Ativos v2 regenerados com sucesso!")


def make_lms_and_admin_assets():
    lms_src = PROP_DIR / "Painel APH_ Emergência em Preparação.png"
    admin_src = PROP_DIR / "Painel admin APH Treinamentos em Destaque.png"

    if lms_src.exists():
        im = Image.open(lms_src).convert("RGB")
        # 1. Banner do curso em andamento (lado direito com o socorrista e ambulância)
        lms_banner = im.crop((610, 82, 1196, 358))
        lms_banner.save(OUT_DIR / "lms-hero-banner.jpg", quality=95)

        # 2. Card inferior da sidebar (Ambulância "Emergência é preparação!")
        lms_amb = im.crop((12, 780, 263, 926))
        lms_amb.save(OUT_DIR / "lms-sidebar-ambulancia.jpg", quality=94)

        # 3. As 4 miniaturas dos cursos em "Meus Cursos"
        im.crop((301, 552, 516, 660)).save(OUT_DIR / "lms-curso-1-aph.jpg", quality=94)
        im.crop((526, 552, 741, 660)).save(OUT_DIR / "lms-curso-2-incendio.jpg", quality=94)
        im.crop((751, 552, 966, 660)).save(OUT_DIR / "lms-curso-3-imobilizacao.jpg", quality=94)
        im.crop((976, 552, 1191, 660)).save(OUT_DIR / "lms-curso-4-hemorragias.jpg", quality=94)

        # 4. Ilustrações dos cards inferiores (Manual de APH e Certificado de Conclusão)
        im.crop((545, 812, 758, 925)).save(OUT_DIR / "lms-manual-aph.jpg", quality=94)
        im.crop((1025, 812, 1198, 925)).save(OUT_DIR / "lms-certificado-thumb.jpg", quality=94)

        # 5. Avatar do aluno Vitor Matos
        im.crop((1434, 10, 1482, 58)).save(OUT_DIR / "lms-avatar-aluno.jpg", quality=95)

    if admin_src.exists():
        im_adm = Image.open(admin_src).convert("RGB")
        im_adm.crop((1434, 10, 1482, 58)).save(OUT_DIR / "admin-avatar-cleve.jpg", quality=95)


if __name__ == "__main__":
    make_lms_and_admin_assets()
    print("Ativos LMS e Admin extraídos com sucesso!")


def make_certificate_assets():
    frente_src = REF_DIR / "BLACK_Certificado_Frente_Modelo.png"
    verso_src = REF_DIR / "BLACK_Certificado_Verso_Conteudo.png"
    if frente_src.exists():
        shutil.copy2(frente_src, OUT_DIR / "certificado-frente.png")
    if verso_src.exists():
        shutil.copy2(verso_src, OUT_DIR / "certificado-verso.png")


if __name__ == "__main__":
    make_certificate_assets()
    print("Certificados oficiais (Frente e Verso) copiados para public/assets/!")


def make_instructor_flip_cards():
    """
    Copia os cartões oficiais Frente (capa) e Verso (info) dos 5 instrutores
    (e do desenvolvedor Vitor de Matos) de referencias/ ou proposta-black/ para public/assets/.
    """
    cards = [
        ("cleverson", "capa black.png", "info black.png"),
        ("iverson", "capa iverson.png", "info iverson.png"),
        ("erika", "capa erika.png", "info erica.png"),
        ("wagner", "capa wagner.png", "info wagner.png"),
        ("salete", "capa salete.png", "info salete.png"),
    ]
    for slug, capa_name, info_name in cards:
        capa_src = REF_DIR / capa_name if (REF_DIR / capa_name).exists() else PROP_DIR / capa_name
        info_src = REF_DIR / info_name if (REF_DIR / info_name).exists() else PROP_DIR / info_name

        if capa_src.exists():
            shutil.copy2(capa_src, OUT_DIR / f"card-{slug}-frente.png")
            # Garante também na pasta referencias/
            if not (REF_DIR / capa_name).exists():
                shutil.copy2(capa_src, REF_DIR / capa_name)
        if info_src.exists():
            shutil.copy2(info_src, OUT_DIR / f"card-{slug}-verso.png")
            if not (REF_DIR / info_name).exists():
                shutil.copy2(info_src, REF_DIR / info_name)

    vitor_src = REF_DIR / "capa vitor-desenvolvedor site.png"
    if not vitor_src.exists():
        vitor_src = PROP_DIR / "capa vitor-desenvolvedor site.png"
    if vitor_src.exists():
        shutil.copy2(vitor_src, OUT_DIR / "card-vitor-dev-frente.png")


if __name__ == "__main__":
    make_instructor_flip_cards()
    print("Cartões Frente e Verso dos 5 instrutores copiados com sucesso!")


def make_hero_3d_logo_and_lightning():
    """
    Processa a Logo 3D para o Hero Section:
    1. Copia `Logo 3D Black Treinamentos Resgate & APH.png` para `public/assets/logo-3d-hero.png`
    2. Cria `public/assets/logo-3d-hero-seamless.png` com suavização de bordas (vignette alpha)
       para que o fundo preto da imagem 3D se funda 100% invisivelmente ao cenário #050505 do Hero.
    3. Copia `ref raios.mp4` para `public/assets/ref-raios.mp4`.
    """
    logo3d_src = REF_DIR / "Logo 3D Black Treinamentos Resgate & APH.png"
    raios_src = REF_DIR / "ref raios.mp4"

    if raios_src.exists():
        shutil.copy2(raios_src, OUT_DIR / "ref-raios.mp4")

    if logo3d_src.exists():
        shutil.copy2(logo3d_src, OUT_DIR / "logo-3d-hero.png")
        im = Image.open(logo3d_src).convert("RGBA")
        w, h = im.size
        print(f"Logo 3D dimensoes: {w}x{h}")

        # Cria versão RGBA onde as bordas externas e o preto puro de fundo ganham alpha suave
        # preservando 100% o brilho vermelho refletido no chão e o volume metálico 3D das letras
        pixels = im.load()
        margin_x = int(w * 0.08)
        margin_y = int(h * 0.10)

        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                # Fator de borda (feathering suave nos cantos da imagem para zero caixa visível)
                fx = 1.0
                fy = 1.0
                if x < margin_x:
                    fx = x / float(margin_x)
                elif x > w - margin_x:
                    fx = (w - x) / float(margin_x)

                if y < margin_y:
                    fy = y / float(margin_y)
                elif y > h - margin_y:
                    fy = (h - y) / float(margin_y)

                edge_factor = min(1.0, fx) * min(1.0, fy)
                # Suaviza curva
                edge_alpha = edge_factor * edge_factor * (3 - 2 * edge_factor)

                # Para pixels muito escuros do fundo preto externo, reduz alpha proporcionalmente
                lum = max(r, g, b)
                if lum < 12:
                    bg_alpha = 0.0
                elif lum < 36:
                    bg_alpha = (lum - 12) / 24.0
                else:
                    bg_alpha = 1.0

                final_alpha = int(255 * min(edge_alpha, bg_alpha if edge_alpha < 0.99 else max(bg_alpha, 0.85)))
                if lum < 16:
                    final_alpha = int(255 * bg_alpha * edge_alpha)

                pixels[x, y] = (r, g, b, final_alpha)

        im.save(OUT_DIR / "logo-3d-hero-seamless.png")


if __name__ == "__main__":
    make_hero_3d_logo_and_lightning()
    print("Logo 3D do Hero e vídeo de raios processados com sucesso!")


def make_clean_3d_logo_v2():
    """
    Gera `public/assets/logo-3d-hero-clean.png` SEM corte de luminância (`lum < 36`),
    preservando 100% o degradê original perfeito da renderização 3D e aplicando apenas
    uma vinheta elíptica suave nas bordas externas para fundir com #050505 sem contornos serrilhados.
    """
    import math
    logo3d_src = REF_DIR / "Logo 3D Black Treinamentos Resgate & APH.png"
    if not logo3d_src.exists():
        return

    im = Image.open(logo3d_src).convert("RGBA")
    w, h = im.size
    pixels = im.load()

    cx, cy = w / 2.0, h / 2.0
    rx, ry = w * 0.48, h * 0.47

    for y in range(h):
         dy = (y - cy) / ry
         dy2 = dy * dy
         for x in range(w):
            r, g, b, _ = pixels[x, y]
            dx = (x - cx) / rx
            dist = math.sqrt(dx * dx + dy2)

            if dist <= 0.78:
                alpha = 1.0
            elif dist >= 1.02:
                alpha = 0.0
            else:
                t = (dist - 0.78) / (1.02 - 0.78)
                # Curva smoothstep contínua
                alpha = 1.0 - (t * t * (3.0 - 2.0 * t))

            pixels[x, y] = (r, g, b, int(255 * alpha))

    im.save(OUT_DIR / "logo-3d-hero-clean.png")


if __name__ == "__main__":
    make_clean_3d_logo_v2()
    print("Logo 3D v2 limpa gerada com sucesso!")


def make_true_transparent_3d_logo_and_hero_bg():
    """
    1. Copia a imagem dos dois socorristas com a ambulância para `public/assets/hero-bg-socorristas.jpg`.
    2. Remove 100% as bordas escuras / fundo preto ao redor da `Logo 3D Black Treinamentos Resgate & APH.png`
       usando desmultiplicação de preto (Black Unmultiplication Keying), de modo que NENHUM pixel preto de
       fundo escureça a foto dos socorristas atrás da logo 3D!
    """
    uploaded_bg = Path(
        r"C:\Users\Nitro\.gemini\antigravity\brain\b99741f0-059d-44b1-b6fe-af632e7be204\.user_uploaded\media_1795392785612_4be2c93b.jpg"
    )
    if uploaded_bg.exists():
        shutil.copy2(uploaded_bg, OUT_DIR / "hero-bg-socorristas.jpg")
        shutil.copy2(uploaded_bg, REF_DIR / "fundo-hero-socorristas.jpg")

    logo3d_src = REF_DIR / "Logo 3D Black Treinamentos Resgate & APH.png"
    if not logo3d_src.exists():
        return

    im = Image.open(logo3d_src).convert("RGBA")
    w, h = im.size
    pixels = im.load()

    for y in range(h):
        for x in range(w):
            r, g, b, _ = pixels[x, y]
            # Luminância máxima e componente vermelho puro
            max_c = max(r, g, b)
            min_c = min(r, g, b)

            # A imagem 3D tem letras metálicas claras (max_c alto) e chanfros/brilhos vermelhos (r >> g, b)
            # O fundo escuro ao redor tem r, g, b baixos (preto ou sombra escura avermelhada)
            # Calculamos a "presença real do objeto 3D" vs "sombra preta de fundo":
            red_energy = max(0, r - max(g, b))
            metal_energy = min_c  # Cinza/branco metálico das faces e laterais 3D

            # Se o pixel é parte sólida da letra 3D (metal claro ou vermelho vivo):
            strength = max(metal_energy * 1.35, min_c + red_energy * 1.15)

            if strength < 24:
                # Fundo preto externo -> 100% transparente (zero borda escura!)
                pixels[x, y] = (0, 0, 0, 0)
            elif strength < 135:
                # Zona de transição/borda da letra 3D:
                # Desmultiplica o preto para que a borda NUNCA fique escura sobre a foto de fundo!
                t = (strength - 24.0) / (135.0 - 24.0)
                alpha_f = t * t * (3.0 - 2.0 * t)
                # Remove o preto dos canais RGB (unmultiply) para preservar apenas a cor pura (vermelho ou prata)
                scale = 1.0 / max(alpha_f, 0.28)
                new_r = min(255, int(r * scale))
                new_g = min(255, int(g * scale))
                new_b = min(255, int(b * scale))
                pixels[x, y] = (new_r, new_g, new_b, int(255 * alpha_f))
            else:
                # Interior sólido da letra 3D
                pixels[x, y] = (r, g, b, 255)

    # Recorta apenas a caixa útil da logo 3D para que ela ocupe ainda melhor o espaço sem margens vazias
    bbox = im.getbbox()
    if bbox:
        pad = 24
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        im = im.crop(crop_box)

    im.save(OUT_DIR / "logo-3d-hero-noborder.png")
    print("Logo 3D sem bordas escuras salva! Dimensões recortadas:", im.size)


if __name__ == "__main__":
    make_true_transparent_3d_logo_and_hero_bg()
