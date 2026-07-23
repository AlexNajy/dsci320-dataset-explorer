from build_classifications import build_classifications
from build_tracker import build_tracker

def main():
    print("Classifying Columns...")
    build_classifications()
    print("Tracking Results...")
    build_tracker()
    print("Done.")

if __name__ == "__main__":
    main()