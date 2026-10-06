// Builds public/og-image-*.jpg (1200x630 link-preview card).
// Usage: swift scripts/og-image.swift <portrait.jpg> public/og-image-vN.jpg  (then update index.html)
import AppKit
let a = CommandLine.arguments
let W = 1200, H = 630
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: W, pixelsHigh: H, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSColor(calibratedRed: 12/255, green: 12/255, blue: 12/255, alpha: 1).setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()
// Portrait on the right, cropped to the upper body
let p = NSImage(contentsOfFile: a[1])!
let pw: CGFloat = 470, ph = pw * p.size.height / p.size.width
p.draw(in: NSRect(x: CGFloat(W) - pw - 20, y: CGFloat(H) - ph * 1.04, width: pw, height: ph), from: .zero, operation: .sourceOver, fraction: 1)
// Fade the portrait's left edge into the background
let g = NSGradient(starting: NSColor(calibratedWhite: 0.047, alpha: 1), ending: NSColor(calibratedWhite: 0.047, alpha: 0))!
g.draw(in: NSRect(x: CGFloat(W) - pw - 20, y: 0, width: 160, height: CGFloat(H)), angle: 0)
let light = NSColor(calibratedRed: 0.73, green: 0.80, blue: 0.84, alpha: 1)
func text(_ s: String, _ size: CGFloat, _ weight: NSFont.Weight, _ y: CGFloat, _ color: NSColor, _ kern: CGFloat = 0) {
  let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.systemFont(ofSize: size, weight: weight), .foregroundColor: color, .kern: kern]
  NSAttributedString(string: s, attributes: attrs).draw(at: NSPoint(x: 70, y: y))
}
text("PRANAV", 104, .black, 380, light, -2)
text("RAJ SINGH", 104, .black, 270, light, -2)
text("CAMPAIGN STRATEGY & BRAND COMMUNICATIONS", 22, .medium, 205, NSColor(calibratedWhite: 0.85, alpha: 1), 2)
text("MSc Marketing @ Strathclyde  ·  Glasgow, UK", 22, .regular, 160, NSColor(calibratedWhite: 0.6, alpha: 1), 0.5)
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.9])!.write(to: URL(fileURLWithPath: a[2]))
