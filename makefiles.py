from pathlib import Path

dir_path = Path.cwd() / 'words'
dir_path.mkdir(exist_ok=True)

for i in range(1, 2001):
    file_name = f'word{i:04d}.txt'          # word0001.txt … word2000.txt
    (dir_path / file_name).write_text('hello', encoding='utf-8')  # change word if you like

print(f'Done! Files are in {dir_path}')