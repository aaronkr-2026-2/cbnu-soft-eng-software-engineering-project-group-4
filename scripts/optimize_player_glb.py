import struct, json, io, os
from PIL import Image

def optimize_player():
    orig_path = "public/models/player.glb"
    bak_path = "public/models/player.glb.bak"
    if not os.path.exists(bak_path):
        with open(orig_path, "rb") as f_in, open(bak_path, "wb") as f_out:
            f_out.write(f_in.read())
        print(f"Backed up original player.glb to {bak_path}")

    with open(orig_path, "rb") as f:
        magic, ver, total_len = struct.unpack("<4sII", f.read(12))
        json_len, json_type = struct.unpack("<II", f.read(8))
        gltf = json.loads(f.read(json_len).decode("utf-8"))
        
        # Read padding if any
        bin_len, bin_type = struct.unpack("<II", f.read(8))
        bin_data = f.read(bin_len)

    img_meta = gltf["images"][0]
    img_bv_idx = img_meta["bufferView"]
    bv = gltf["bufferViews"][img_bv_idx]
    
    img_offset = bv.get("byteOffset", 0)
    img_len = bv["byteLength"]
    
    raw_img = bin_data[img_offset:img_offset+img_len]
    pil_img = Image.open(io.BytesIO(raw_img))
    
    print(f"Original player texture: {pil_img.size}, {len(raw_img)/1e6:.2f} MB")
    
    # Resize to 2048x2048 high-quality JPEG
    resized = pil_img.convert("RGB").resize((2048, 2048), Image.LANCZOS)
    out_io = io.BytesIO()
    resized.save(out_io, format="JPEG", quality=90, optimize=True)
    new_img_bytes = out_io.getvalue()
    
    # Pad to 4-byte boundary
    pad_len = (4 - (len(new_img_bytes) % 4)) % 4
    padded_img_bytes = new_img_bytes + (b"\x00" * pad_len)
    
    print(f"Optimized texture: (2048, 2048), {len(new_img_bytes)/1e6:.2f} MB")
    
    # Rebuild bin_data
    new_bin_data = bin_data[:img_offset] + padded_img_bytes
    
    # Update gltf JSON
    gltf["images"][0]["mimeType"] = "image/jpeg"
    gltf["bufferViews"][img_bv_idx]["byteLength"] = len(new_img_bytes)
    gltf["buffers"][0]["byteLength"] = len(new_bin_data)
    
    new_json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    json_pad_len = (4 - (len(new_json_bytes) % 4)) % 4
    padded_json = new_json_bytes + (b" " * json_pad_len)
    
    new_total_len = 12 + 8 + len(padded_json) + 8 + len(new_bin_data)
    
    header = struct.pack("<4sII", magic, ver, new_total_len)
    json_chunk_hdr = struct.pack("<II", len(padded_json), json_type)
    bin_chunk_hdr = struct.pack("<II", len(new_bin_data), bin_type)
    
    with open(orig_path, "wb") as f_out:
        f_out.write(header)
        f_out.write(json_chunk_hdr)
        f_out.write(padded_json)
        f_out.write(bin_chunk_hdr)
        f_out.write(new_bin_data)
        
    orig_mb = total_len / 1e6
    new_mb = new_total_len / 1e6
    print(f"Player.glb: {orig_mb:.2f} MB -> {new_mb:.2f} MB (saved {(orig_mb - new_mb):.2f} MB, -{((orig_mb-new_mb)/orig_mb)*100:.1f}%)")

if __name__ == "__main__":
    optimize_player()

