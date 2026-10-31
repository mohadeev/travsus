# Builds "Travsus Sans" from Figtree (SIL OFL 1.1): renamed, slightly tighter
# spacing, the tailed l / serifed I (ss02) as the default letters, woff2.
#
#   curl -sL -o Figtree.ttf "https://github.com/google/fonts/raw/main/ofl/figtree/Figtree%5Bwght%5D.ttf"
#   pip install fonttools brotli
#   python scripts/fonts/build-travsus-sans.py Figtree.ttf src/fonts/travsus-sans/TravsusSans.woff2 1
#
# The licence (OFL.txt) must stay next to the font.
import sys
from fontTools.ttLib import TTFont

src, out, bake_ss02 = sys.argv[1], sys.argv[2], sys.argv[3] == '1'
f = TTFont(src)

# 1. Default letters: the ss02 l and I
if bake_ss02:
    gsub = f['GSUB'].table
    mapping = {}
    for fr in gsub.FeatureList.FeatureRecord:
        if fr.FeatureTag == 'ss02':
            for li in fr.Feature.LookupListIndex:
                for st in gsub.LookupList.Lookup[li].SubTable:
                    mapping.update(st.mapping)
    mapping = {k: v for k, v in mapping.items() if not k.startswith('zero')}
    for table in f['cmap'].tables:
        for cp, name in list(table.cmap.items()):
            if name in mapping:
                table.cmap[cp] = mapping[name]

# 2. Fuller weights: Figtree's Regular reads a little thin on screens, so each
#    named weight draws a bit heavier (Light and Black stay where they are)
seg = f['avar'].segments['wght']
FULLER = {400: 0.21, 500: 0.32, 600: 0.455, 700: 0.62}
for weight, value in FULLER.items():
    key = min(seg, key=lambda k: abs(k - (weight - 300) / 600))
    seg[key] = value

# 3. A touch tighter: 8/1000 em less on every letter
TIGHTEN = 8
hmtx = f['hmtx'].metrics
for name, (adv, lsb) in hmtx.items():
    if adv > 100:
        hmtx[name] = (adv - TIGHTEN, lsb)

# 4. Our name
FAMILY = 'Travsus Sans'
name = f['name']
for rec in list(name.names):
    if rec.nameID in (1, 4, 16, 21):
        rec.string = FAMILY if rec.nameID != 4 else FAMILY
    elif rec.nameID == 6:
        rec.string = 'TravsusSans'
    elif rec.nameID == 3:
        rec.string = '1.000;TRVS;TravsusSans'
    elif rec.nameID == 25:
        rec.string = 'TravsusSans'
    elif rec.nameID == 0:
        rec.string = 'Copyright 2022 The Figtree Project Authors (https://github.com/erikdkennedy/figtree). Travsus Sans modifications 2026 TRAVSUS.'
for nid, text in ((5, 'Version 1.000'), (8, 'TRAVSUS'), (10, 'Travsus Sans, the TRAVSUS typeface. Based on Figtree by Erik Kennedy (SIL Open Font License 1.1).'), (13, 'This Font Software is licensed under the SIL Open Font License, Version 1.1.'), (14, 'https://openfontlicense.org')):
    name.setName(text, nid, 3, 1, 0x409)
# Weight instance names (ExtraBold…) and their PostScript names still say Figtree
for rec in name.names:
    if rec.nameID > 255 or rec.nameID == 6:
        rec.string = rec.toUnicode().replace('Figtree', 'TravsusSans')
f['OS/2'].achVendID = 'TRVS'

f.flavor = 'woff2'
f.save(out)
print('saved', out)
