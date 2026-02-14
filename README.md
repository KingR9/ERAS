# 💕 Our Eras 💕

An interactive, Taylor Swift-themed experience built with pure frontend magic. Hunt for 13 Easter eggs across different "tracks" (sections) inspired by Taylor's eras, unlock the vault, and reveal the final track.

## ✨ Features

- **13 Hidden Easter Eggs** scattered across 6 main tracks
- **4 Era Themes**: Lover, Folklore, Reputation, and Midnights
- **Interactive Elements**: Thread canvas, star field, snake-to-flower transformation
- **Vault System**: Unlocks when all 13 eggs are found
- **Final Track Reveal**: Spotify embed of "Invisible String"
- **Hidden Capital Letter Cipher**: Spells "ALWAYS"
- **LocalStorage Persistence**: Your progress is saved
- **Console Easter Eggs**: Developer messages and secrets
- **Time-Based Greetings**: Different messages based on time of day
- **Responsive Design**: Works on all devices

## 🎯 Easter Eggs Locations

1. **Track 1** - Hidden "13" in the sky (top right)
2. **Track 2** - Thread knot (clickable sparkle)
3. **Track 3** - Snake icon (before clicking truce)
4. **Track 4** - 5 special glowing stars among the star field
5. **Track 5** - Hidden in the text (Track 5 is the emotional core)
6. **Track 6** - 4 vault treasures (red scarf, typewriter, clock, secret message)


## 📁 File Structure

```
eras-your-version/
├── index.html          # Main HTML file
├── css/
│   ├── base.css       # Core styles
│   ├── themes.css     # Era-specific themes
│   └── animations.css # All animations
├── js/
│   ├── app.js         # Main application logic
│   ├── state.js       # State management
│   ├── eggs.js        # Easter egg system
│   ├── vault.js       # Vault unlock logic
│   └── theme.js       # Theme switching
└── README.md          # This file
```

## 🎨 Customization

### Change the Final Song

Edit `index.html` line ~120, replace the Spotify iframe `src` with another song:

```html
<iframe src="https://open.spotify.com/embed/track/YOUR-TRACK-ID"></iframe>
```

**Recommended Taylor songs:**
- Lover: `1dGr1c8CrMLDpV6mPbImSI`
- Daylight: `1fzgthkEnX0gSd9akBaho5`
- Sweet Nothing: `3ViaDDQ7Y8wF8NffNvd9h8`
- Invisible String: `1yA2dIYdRFHd2xr9vxwDnM` (current)

### Change Theme Colors

Edit `css/themes.css` and modify the CSS variables for each era.

### Add More Easter Eggs

1. Add a new element with `data-egg="yourEggId"` in HTML
2. Add the egg ID to `easterEggs` object in `js/state.js`
3. Update `totalEggs` count in `js/state.js`

## 🎵 Swiftie Details

- **Track 5 Significance**: Purposely minimal - Track 5 is always the emotional core in Taylor's albums
- **The Number 13**: Taylor's lucky number, appears throughout
- **Version Naming**: "Your Version" references Taylor's re-recordings
- **Snake → Flower**: Reputation era reclamation arc
- **Vault System**: References "From The Vault" tracks
- **Hidden Message**: Capital letters spell "ALWAYS"

## 🛠️ Technical Details

- **Pure Vanilla JS** - No frameworks, no dependencies
- **CSS Variables** - Instant theme switching
- **LocalStorage** - Persistent progress
- **Intersection Observer** - Track detection
- **Canvas API** - Thread drawing effect
- **CSS Animations** - Smooth, performant effects

## 🐛 Troubleshooting

**Easter eggs not saving:**
- Check if LocalStorage is enabled in your browser
- Try clearing cache and refreshing

**Theme switching not working:**
- Clear browser cache
- Check browser console for errors

**Spotify embed not loading:**
- Ensure you're on HTTPS (GitHub Pages provides this)
- Check if Spotify embed URLs are accessible in your region

## 💝 Credits

Built with love, Taylor Swift's discography, and way too much coffee.

**Era References:**
- Lover (2019)
- Folklore (2020)
- Reputation (2017)
- Midnights (2022)

## 📄 License

This is a personal project created as a gift. Taylor Swift and her work belong to Taylor Swift. This is a fan tribute.

---

**Version**: v1.3.13 

Made with 💕 for Swifties everywhere.
