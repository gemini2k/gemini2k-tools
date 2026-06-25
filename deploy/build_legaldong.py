# -*- coding: utf-8 -*-
"""법정동 CSV → 경량 JSON 변환 (현행만).

국토교통부_전국 법정동_YYYYMMDD.csv (UTF-8 BOM, 삭제일자 컬럼 포함)에서
현행 법정동(삭제일자 없음)만 추려 compact JSON 으로 변환한다.

출력: tools/legaldong.json
  {
    "updated": "20260609",          # 데이터 기준일 (파일명에서 추출)
    "count": 20561,
    "cols": ["code","sido","sgg","emd","ri"],
    "rows": [["4167033028","경기도","수원시","반월동","상호리"], ...]
  }

법정동코드 10자리 = 시도(2) 시군구(3) 읍면동(3) 리(2). 행 단위 평탄 배열로
두고 검색/필터는 클라이언트 JS 에서 처리한다.

실행: python deploy/build_legaldong.py
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # tools/
SRC_GLOB = "국토교통부_전국 법정동_*.csv"
OUT = ROOT / "legaldong.json"


def find_source() -> Path:
    matches = sorted(ROOT.glob(SRC_GLOB))
    if not matches:
        sys.exit(f"[build_legaldong] 원본 CSV 없음: {ROOT}/{SRC_GLOB}")
    return matches[-1]  # 가장 최근 파일명 (날짜 정렬)


def extract_date(name: str) -> str:
    m = re.search(r"(\d{8})", name)
    return m.group(1) if m else ""


def main() -> None:
    src = find_source()
    updated = extract_date(src.name)

    rows = []
    with src.open(encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for r in reader:
            if r.get("삭제일자", "").strip():
                continue  # 폐지 동 제외 (현행만)
            rows.append([
                r["법정동코드"].strip(),
                r["시도명"].strip(),
                r["시군구명"].strip(),
                r["읍면동명"].strip(),
                r["리명"].strip(),
            ])

    payload = {
        "updated": updated,
        "count": len(rows),
        "cols": ["code", "sido", "sgg", "emd", "ri"],
        "rows": rows,
    }

    # ensure_ascii=False 로 한글 그대로 (nginx gzip 으로 전송 압축)
    OUT.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    size_kb = OUT.stat().st_size / 1024
    print(f"[build_legaldong] {src.name} → {OUT.name}")
    print(f"  현행 {len(rows):,}행 / {size_kb:,.0f} KB / 기준일 {updated}")


if __name__ == "__main__":
    main()
