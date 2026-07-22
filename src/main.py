from build_classifications import build_classifications
from build_tracker import build_tracker

def main():
    print("Classifying and Recording Columns...")
    build_classifications()
    print("Comparing and Tracking Results...")
    build_tracker()
    print("Done.")

# Claude said to include this (allows for safe importing)
if __name__ == "__main__":
    main()